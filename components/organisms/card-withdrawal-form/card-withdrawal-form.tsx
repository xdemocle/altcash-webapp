import { Alert, Box, Grid, Snackbar, TextField } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import { UPDATE_ORDER } from '~/graphql/mutations';
import { useGraphQLMutation } from '~/hooks/use-graphql-mutation';
import { BuyButton, ConfirmationGrid, ConfirmationTitle, RootCard } from './components';

interface CardWithdrawalFormProps {
  orderId: string;
  symbol: string;
}

const CardWithdrawalForm: FC<CardWithdrawalFormProps> = ({ orderId, symbol }) => {
  const [formDisabled, setFormDisabled] = useState(false);
  const [addressValue, setAddressValue] = useState('');
  const [showAddressSent, setShowAddressSent] = useState(false);
  const { mutate: updateOrder, error: errorUpdateOrder } = useGraphQLMutation(UPDATE_ORDER);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormDisabled(true);

    updateOrder(
      { id: orderId, input: { wallet: addressValue } },
      {
        onSuccess: () => {
          setShowAddressSent(true);
        },
        onSettled: () => {
          setFormDisabled(false);
        },
      }
    );
  };

  const onCloseAlertHandler = () => {
    setShowAddressSent(false);
    setFormDisabled(false);
  };

  return (
    <>
      <RootCard>
        <ConfirmationGrid>
          <Box sx={{ width: '100%' }}>
            <ConfirmationTitle>Withdraw to your {symbol} Wallet</ConfirmationTitle>

            <form noValidate method="POST" onSubmit={onSubmitHandler}>
              <Grid container gap={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    placeholder={`Insert your ${symbol} wallet's address`}
                    fullWidth
                    variant="outlined"
                    value={addressValue}
                    onChange={e => setAddressValue(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3.765 }}>
                  <BuyButton variant="contained" color="primary" type="submit" disabled={formDisabled}>
                    Widthdraw
                  </BuyButton>
                </Grid>
              </Grid>
            </form>
          </Box>
        </ConfirmationGrid>
      </RootCard>

      <Snackbar open={showAddressSent} autoHideDuration={6000} onClose={onCloseAlertHandler}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Address sent correctly
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorUpdateOrder} autoHideDuration={6000} onClose={onCloseAlertHandler}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Withdrawal problems, try again...
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardWithdrawalForm;
