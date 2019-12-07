import reqClient from 'libs/reqClient';

export const getOnboarding = async (option = {}) => {
  return await reqClient
    .get('/commission/onboarding', {
      params: {
        page: 0,
        limit: 50,
        ...option
      }
    })
    .then(res => res.data && res.data.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};

// export const getAgentCommission = async (option = {}) => {
//   return await reqClient
//     .get('/commission/transaction', {
//       params: {
//         page: 0,
//         limit: 50,
//         ...option
//       }
//     })
//     .then(res => res.data && res.data.data)
//     .catch(err => {
//       console.error(err);
//       return null;
//     });
// };

export const getCommissionWallet = async (option = {}) => {
  return await reqClient
    .get('/commission/wallet')
    .then(res => res.data && res.data.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};

export const getAgentCommission = async (id, params) => {
  return await reqClient
    .get(`/commission/${id}/summary`, { params })
    .then(res => res.data && res.data.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};

export const cashOutToWallet = async cashOutData => {
  return await reqClient
    .post('/cashout', cashOutData)
    .then(res => res.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};

export const getCommissionHistory = async () => {
  return await reqClient
    .get('/cashout/history')
    .then(res => res.data && res.data.data)
    .catch(err => {
      console.error(err);
      return null;
    });
};
