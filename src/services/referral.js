import reqClient from 'libs/reqClient';

export const getReferrals = async (option = {}) => {
  return await reqClient
    .get('/referrals', {
      params: { page: 0, limit: 50, ...option },
    })
    .then(res => res.data && res.data.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};

export const addReferral = async params => {
  return await reqClient.post('/referrals', params).then(res => res.data);
};
