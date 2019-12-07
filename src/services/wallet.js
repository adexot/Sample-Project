import reqClient from 'libs/reqClient';

export const getWalletBalance = async () => {
  return await reqClient.get('/me/balance').then(res => res.data);
};
