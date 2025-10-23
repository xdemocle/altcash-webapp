import { PAYSTACK_EMAIL, PAYSTACK_PUBLICK_KEY } from './constants';
import { PaystackCurrency } from './types';

export const svgCoinPathHelper = (name: string) => {
  try {
    return require(`cryptocurrency-icons/svg/color/${name}.svg`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`SVG not found for coin: ${name}`);
    }
    return null;
  }
};

export const strPxRem = (px: string) => {
  return Number(px.replace('px', ''));
};

export const persistFavourites = (coins: string[]) => {
  if (isServer()) return;
  window.localStorage.setItem('userCoinFavourites', JSON.stringify(coins));
};

export const getPaystackConfig = (amount: number) => {
  return {
    key: PAYSTACK_PUBLICK_KEY as string,
    email: PAYSTACK_EMAIL as string,
    amount: Number(Number(amount * 100).toFixed(0)),
    reference: new Date().getTime().toString(),
    currency: 'ZAR' as PaystackCurrency,
  };
};

export const isServer = () => typeof window === 'undefined';
