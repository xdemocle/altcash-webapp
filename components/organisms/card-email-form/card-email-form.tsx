import { Alert, Box, Button, Card, Grid, Snackbar, TextField } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import { UPDATE_ORDER } from '~/graphql/mutations';
import { useGraphQLMutation } from '~/hooks/use-graphql-mutation';
import useStyles from './use-styles';

interface CardEmailFormProps {
  orderId: string;
}

const CardEmailForm: FC<CardEmailFormProps> = ({ orderId }) => {
  const { classes } = useStyles();
  const [formDisabled, setFormDisabled] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const { mutate: updateOrder, error: errorUpdateOrder } = useGraphQLMutation(UPDATE_ORDER);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormDisabled(true);

    updateOrder(
      { id: orderId, input: { email: emailValue } },
      {
        onSuccess: () => {
          setShowEmailSent(true);
        },
        onSettled: () => {
          setFormDisabled(false);
        },
      }
    );
  };

  const onCloseAlertHandler = () => {
    setShowEmailSent(false);
    setFormDisabled(false);
  };

  return (
    <>
      <Card className={classes.root}>
        <Box className={classes.confirmationGrid}>
          <Box sx={{ width: '100%' }}>
            <h2 className={classes.confirmationTitle}>Send order to E-Mail</h2>

            <form noValidate method="POST" onSubmit={onSubmitHandler}>
              <Grid container gap={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Insert your e-mail"
                    fullWidth
                    variant="outlined"
                    slotProps={{
                      htmlInput: {
                        maxLength: 25,
                      },
                    }}
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3.765 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.buyButton}
                    disabled={formDisabled}
                  >
                    Send order copy
                  </Button>
                </Grid>
              </Grid>
            </form>

            {/* <hr className={classes.confirmationSeparator} /> */}
          </Box>
        </Box>
      </Card>

      <Snackbar open={showEmailSent} autoHideDuration={6000} onClose={onCloseAlertHandler}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Email sent correctly
        </Alert>
      </Snackbar>

      <Snackbar open={!!errorUpdateOrder} autoHideDuration={6000} onClose={onCloseAlertHandler}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Error updating order!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardEmailForm;
