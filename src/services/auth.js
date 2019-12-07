import reqClient from 'libs/reqClient';

export const loginUser = loginDetails => {
  return reqClient.post('/login', loginDetails);
};
