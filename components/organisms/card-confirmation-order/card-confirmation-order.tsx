import { Alert, Box, Snackbar, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Market } from '~/graphql/types';
import NumberFormatText from '../../atoms/number-format-text';
import Loader from '../../molecules/loader';
import {
  ConfirmationGrid,
  ConfirmationGridCard,
  ConfirmationGridCol,
  ConfirmationLoader,
  ConfirmationLoaderText,
  ConfirmationSeparator,
  ConfirmationTitle,
  ConfirmationTitleRed,
  Logs,
  OrderReference,
} from './components';

interface CardConfirmationOrderProps {
  symbol: Market['symbol'];
  cryptoCurrency: number;
  totalAmount: number;
  orderNumber: string;
  pin?: string;
  waitingOrderConfirmation?: boolean;
  orderReferences?: string[];
  hasErrors?: boolean;
}

const CardConfirmationOrder: FC<CardConfirmationOrderProps> = ({
  symbol,
  cryptoCurrency,
  totalAmount,
  orderNumber,
  pin,
  waitingOrderConfirmation,
  orderReferences,
  hasErrors,
}) => {
  const [showPinTooltip, setShowPinTooltip] = useState(false);
  const [showPinAlert, setShowPinAlert] = useState(false);

  const onClickPinHandler = () => {
    setShowPinTooltip(true);
    setShowPinAlert(true);
  };

  const onClosePinHandler = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowPinAlert(false);
  };

  const transformReference = (originalReference: string) => {
    const reference = JSON.parse(originalReference);

    if (!reference.status) {
      return JSON.stringify(reference);
    }

    return JSON.stringify({
      status: reference.status,
      executedQty: reference.executedQty,
      origQty: reference.origQty,
    });
  };

  return (
    <>
      <ConfirmationGrid>
        <ConfirmationGridCol>
          <ConfirmationGridCard>
            <ConfirmationTitle>Payment received</ConfirmationTitle>

            {pin && <ConfirmationTitleRed>Take note of data below</ConfirmationTitleRed>}

            <Typography>Your order number: {orderNumber}</Typography>
            <Typography>
              Your PIN:{' '}
              <Tooltip
                placement="top"
                arrow
                title="This PIN can also be sent via e-mail to you below."
                open={showPinTooltip}
              >
                <a
                  href="#"
                  onClick={onClickPinHandler}
                  onMouseOver={() => setShowPinTooltip(true)}
                  onMouseOut={() => setShowPinTooltip(false)}
                >
                  ****
                </a>
              </Tooltip>
            </Typography>

            <ConfirmationSeparator />

            <Typography>
              You bought: <NumberFormatText decimalScale={6} value={cryptoCurrency} /> {symbol}
            </Typography>

            <Typography>
              You spent: <NumberFormatText value={Number(totalAmount)} decimalScale={2} /> ZAR
            </Typography>
          </ConfirmationGridCard>
        </ConfirmationGridCol>

        <ConfirmationGridCol>
          <ConfirmationGridCard>
            {!waitingOrderConfirmation && !hasErrors ?
              <ConfirmationLoader>
                <Loader text="Waiting for the exchange order..." centered />
              </ConfirmationLoader>
            : hasErrors ?
              <ConfirmationLoader className={`float-animation`}>
                <Image src="/assets/error-illustration.png" width="128" height="128" alt="error-illustration.png" />
                <ConfirmationLoaderText>
                  Order with problems.
                  <br />
                  Please, contact Support.
                </ConfirmationLoaderText>
              </ConfirmationLoader>
            : <ConfirmationLoader className={`float-animation`}>
                <Image
                  src="/assets/transparent-yellow-dollar-coins-illustration.png"
                  width="200"
                  height="130"
                  alt="transparent-yellow-dollar-coins-illustration.png"
                />
                <ConfirmationLoaderText>Order confirmed and coins allocated.</ConfirmationLoaderText>
              </ConfirmationLoader>
            }

            <ConfirmationSeparator />

            <Box>
              <Logs>
                Order logs:
                {orderReferences?.map((reference, ix) => (
                  <OrderReference key={ix} title={transformReference(reference)}>
                    {transformReference(reference)}
                  </OrderReference>
                ))}
              </Logs>
            </Box>
          </ConfirmationGridCard>
        </ConfirmationGridCol>
      </ConfirmationGrid>

      <Snackbar open={showPinAlert} autoHideDuration={6000} onClose={onClosePinHandler}>
        <Alert onClose={onClosePinHandler} severity="info" sx={{ width: '100%' }}>
          Your PIN is: {pin}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardConfirmationOrder;
