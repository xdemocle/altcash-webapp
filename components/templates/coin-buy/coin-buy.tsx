'use client';

import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Box, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import {
  MIN_AMOUNT_EXTRA,
  MIN_AMOUNT_MULTIPLIER,
  PERCENTAGE_FEE, // PERCENTAGE_FEE_EXCHANGE,
  PERCENTAGE_FEE_PAYMENT,
} from 'common/constants';
import { getPaystackConfig, isServer } from 'common/utils';
import { CREATE_ORDER, UPDATE_ORDER } from 'graphql/mutations';
import { BinanceMarket, Order, OrderParams, Ticker } from 'graphql/types';
import useGlobal from 'hooks/use-global';
import { useGraphQLMutation } from 'hooks/use-graphql-mutation';
import useMultiplier from 'hooks/use-multiplier';
import useRound from 'hooks/use-round';
import { useRouter } from 'next/navigation';
import { FC, FormEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';
import NumberFormatText from '../../atoms/number-format-text';
import {
  BoxBuyButtonRoot,
  BoxBuyLed,
  BuyButton,
  BuyButtonContainer,
  Flex,
  GridItem,
  GridTitle,
  GridWrapper,
  InnerCard,
  InnerCardRoot,
  RootCard,
  Symbol,
} from './components';

interface CoinBuyProps {
  coin?: BinanceMarket;
  ticker?: Ticker;
}

const CoinBuy: FC<CoinBuyProps> = ({ coin, ticker }) => {
  const router = useRouter();
  const { getRound } = useRound();
  const { bitcoinRandPrice } = useGlobal();
  const [notional, setNotional] = useState(0);
  const [bulbColor, setBulbColor] = useState('green');
  const [orderInfo, setOrderInfo] = useState('');
  const [triggerConfirmationOrder, setTriggerConfirmationOrder] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [localCurrency, setLocalCurrency] = useState(0);
  const [cryptoCurrency, setCryptoCurrencyValue] = useState(0);
  const { multiplier } = useMultiplier(ticker || { id: '', symbol: '', price: '' });
  const [paystack, setInitializePayment] = useState<unknown>(null);

  // Only initialize Paystack on client side
  useEffect(() => {
    if (paystack) return;

    import('@paystack/inline-js').then(Paystack => {
      const paystack = new Paystack.default();
      setInitializePayment(paystack);
    });
  }, []);

  const {
    mutate: createOrder,
    isPending: isCreatingOrder,
    error: errorCreateOrder,
  } = useGraphQLMutation<OrderParams, { createOrder: Order }>(CREATE_ORDER);

  const {
    mutate: updateOrder,
    isPending: isUpdatingOrder,
    error: errorUpdateOrder,
  } = useGraphQLMutation<{ id: string; input: OrderParams }, { updateOrder: Order }>(UPDATE_ORDER);

  if (errorCreateOrder || errorUpdateOrder) {
    console.debug('Mutations', errorCreateOrder, errorUpdateOrder);
  }

  const setCryptoCurrency = (value: number) => {
    if (!coin) return;
    const valueRounded = getRound(value, coin.stepSize ?? 1);
    setCryptoCurrencyValue(Number(valueRounded.toFixed(coin.quotePrecision ?? 0)));
  };

  const updateOrderHandler = async (input: OrderParams) => {
    const id = orderInfo.split('/')[0];

    // UPDATE new order to backend with payment reference
    return new Promise(resolve => {
      updateOrder(
        { id, input },
        {
          onSuccess: data => resolve(data),
        }
      );
    });
  };

  const updateOrderWithReference = async (reference: string) => {
    // UPDATE new order to backend with payment reference
    const data = await updateOrderHandler({
      amount: '',
      total: '',
      symbol: '',
      isPaid: true,
      reference: JSON.stringify(reference),
    });

    console.debug('updateOrderWithReference', data);
  };

  const updateOrderCancelled = async () => {
    // UPDATE new order to backend to cancel it
    const data = await updateOrderHandler({
      amount: '',
      total: '',
      symbol: '',
      isCancelled: true,
    });

    console.debug('updateOrderCancelled', data);
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!coin) return;
    setFormDisabled(true);

    // POST new order to backend
    if (!orderInfo.length) {
      try {
        createOrder(
          {
            amount: String(cryptoCurrency),
            total: String(totalAmount),
            symbol: coin.symbol,
          },
          {
            onSuccess: data => {
              const createdOrder = data?.createOrder;

              if (!createdOrder) {
                throw new Error('Create order mutation returned no data');
              }

              const orderId = createdOrder.symbol || '';
              setOrderInfo(
                orderId + '/' + createdOrder.amount + '/' + createdOrder.total + '/' + (createdOrder.pin || '')
              );
            },
            onError: error => {
              setOrderInfo('');
              console.debug(error);
            },
            onSettled: () => {
              setFormDisabled(false);
            },
          }
        );
      } catch (error) {
        setOrderInfo('');
        console.debug(error);
        setFormDisabled(false);
      }
    } else {
      setFormDisabled(false);
    }
  };

  const onPaymentSuccess = (reference: string) => {
    console.debug('onPaymentSuccess', reference);
    // UPDATE update order to backend with provider payment reference
    updateOrderWithReference(reference);
    setTriggerConfirmationOrder(true);
  };

  const onPaymentClose = () => {
    console.debug('onPaymentClose');
    updateOrderCancelled();
    setOrderInfo('');
    setFormDisabled(false);
  };

  const gotoConfirmationOrder = () => {
    if (!coin || isServer()) return;
    const orderNumberRawArray = orderInfo.split('/');
    let slashedString = `${coin.symbol}/${orderNumberRawArray[0]}/${orderNumberRawArray[1]}/${orderNumberRawArray[2]}`;

    // For the pin
    if (orderNumberRawArray[3]) {
      slashedString = `${slashedString}/${orderNumberRawArray[3]}`;
    }

    router.push(`/orders/${window.btoa(slashedString)}`);
  };

  const onFocusInputHandler = (e: SyntheticEvent | Event) => {
    // (e?.target as HTMLInputElement).select();
  };

  const onBlurLocalCurrencyHandler = () => {
    if (localCurrency !== cryptoCurrency / multiplier) {
      setLocalCurrency(cryptoCurrency * multiplier);
    }
  };

  useEffect(() => {
    if (!coin || orderInfo.length === 0) return;
    if (localCurrency > (coin.minTradeSize ?? 0) * multiplier * MIN_AMOUNT_MULTIPLIER + MIN_AMOUNT_EXTRA) {
      (paystack as { newTransaction?: (args: Record<string, unknown>) => void })?.newTransaction?.({
        ...getPaystackConfig(totalAmount),
        onSuccess: onPaymentSuccess,
        onClose: onPaymentClose,
      });
    }
  }, [orderInfo, localCurrency, coin, multiplier, totalAmount, paystack]);

  useEffect(() => {
    if (triggerConfirmationOrder) {
      gotoConfirmationOrder();
      setTriggerConfirmationOrder(false);
    }
  }, [triggerConfirmationOrder]);

  useEffect(() => {
    if (coin?.status === 'TRADING') {
      setBulbColor('yellow');
      setTimeout(() => setBulbColor('green'), 3000);
    }
  }, [coin?.status]);

  useEffect(() => {
    setCryptoCurrency(localCurrency / multiplier);

    setTotalAmount(
      localCurrency +
        (PERCENTAGE_FEE_PAYMENT / 100) * localCurrency +
        // Minimum Rand fee for payment provider fixed cost
        1 +
        (PERCENTAGE_FEE / 100) * localCurrency
    );
  }, [localCurrency, multiplier]);

  useEffect(() => {
    if (coin?.minNotional && bitcoinRandPrice) {
      setNotional(coin.minNotional * bitcoinRandPrice);
    }

    if (coin?.status !== 'TRADING') {
      setBulbColor('red');
    }
  }, [coin, bitcoinRandPrice]);

  const minTradeAmount = useMemo(
    () => (coin?.minTradeSize ?? 0) * multiplier * MIN_AMOUNT_MULTIPLIER + MIN_AMOUNT_EXTRA + notional,
    [coin?.minTradeSize, notional, multiplier]
  );

  return (
    <form noValidate autoComplete="off" method="POST" onSubmit={onSubmitHandler}>
      <RootCard>
        <GridWrapper>
          <Grid size={{ xs: 12, md: 4 }} component={GridItem} sx={{ minWidth: '45%' }}>
            <GridTitle htmlFor="gridLeftInput">
              You pay in <strong>Rand (ZAR)</strong>
            </GridTitle>
            <TextField
              id="gridLeftInput"
              name="localCurrency"
              fullWidth
              helperText={
                <ReactPlaceholder type="textRow" ready={!!coin}>
                  Min: R {(minTradeAmount || 0).toFixed(2)}
                </ReactPlaceholder>
              }
              variant="outlined"
              type="number"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">R</InputAdornment>,
                },
                htmlInput: {
                  maxLength: 25,
                  min: Number((minTradeAmount || 0).toFixed(2)),
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                },
              }}
              value={localCurrency.toFixed(2)}
              onChange={e => setLocalCurrency(Number(e.target.value))}
              onFocus={onFocusInputHandler}
              disabled={formDisabled}
              onBlur={onBlurLocalCurrencyHandler}
            />
          </Grid>

          <Flex>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <ArrowForward color="primary" sx={{ width: '2rem !important', height: '2rem !important' }} />
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <ArrowDownward
                color="primary"
                sx={{ width: '3rem !important', height: '3rem !important', margin: '1.5rem 0 1rem 0' }}
              />
            </Box>
          </Flex>

          <Grid size={{ xs: 12, md: 4 }} component={GridItem} sx={{ minWidth: '45%' }}>
            <GridTitle htmlFor="gridRightInput">
              You get <Symbol>{coin?.name}</Symbol>
            </GridTitle>
            <TextField
              id="gridRightInput"
              name="cryptoCurrency"
              fullWidth
              helperText={
                <ReactPlaceholder type="textRow" ready={!!coin}>
                  Step: {coin?.stepSize}
                </ReactPlaceholder>
              }
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="start">{coin?.symbol || ''}</InputAdornment>,
                },
              }}
              value={String(cryptoCurrency)}
              onFocus={onFocusInputHandler}
              disabled
            />
          </Grid>
        </GridWrapper>

        <BoxBuyButtonRoot>
          <BuyButtonContainer>
            <BuyButton
              variant="contained"
              color="primary"
              type="submit"
              disabled={localCurrency <= minTradeAmount || formDisabled || bulbColor === 'red'}
            >
              Buy Now
            </BuyButton>
          </BuyButtonContainer>
        </BoxBuyButtonRoot>

        <BoxBuyLed>
          <div className={`led-${bulbColor}`}></div>
        </BoxBuyLed>
      </RootCard>

      <InnerCard
        className={clsx(
          coin &&
            localCurrency > (coin.minTradeSize ?? 0) * multiplier * MIN_AMOUNT_MULTIPLIER + MIN_AMOUNT_EXTRA &&
            'open'
        )}
      >
        <InnerCardRoot>
          <Typography
            variant="h6"
            sx={{
              borderBottom: '0.1rem solid',
              marginTop: '0.2rem',
              paddingTop: '0.2rem',
              paddingBottom: '0.2rem',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
            }}
            color="primary"
          >
            (Total buy) R {totalAmount.toFixed(2)} =
          </Typography>
          (amount selected) R <NumberFormatText decimalScale={2} value={Number(localCurrency)} /> +
          <br />
          (payment fee) R{' '}
          <NumberFormatText decimalScale={2} value={(PERCENTAGE_FEE_PAYMENT / 100) * localCurrency + 1} /> +<br />
          (altcash fee) R <NumberFormatText decimalScale={2} value={(PERCENTAGE_FEE / 100) * localCurrency} /> +
          <br />
        </InnerCardRoot>
      </InnerCard>
    </form>
  );
};

export default CoinBuy;
