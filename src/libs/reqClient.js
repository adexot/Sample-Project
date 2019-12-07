import axios from 'axios';
import constants from '../constants';
import { localStore } from 'libs';

/**
 * Get the user's token
 */
const getToken = () => {
  const userData = localStore.get(constants.userStoreName, true);

  if (!userData) {
    return '';
  }

  try {
    const token = userData && userData.jwt;

    if (token) return `Bearer ${token}`;
    throw Error('Token not found');
  } catch {
    localStorage.removeItem(constants.userContext);
    return '';
  }
};

const client = axios.create({
  baseURL: constants.kaguRoot,
  transformResponse: [
    /**
     * Throw errors when the API returns non-success responses
     */
    data => {
      let resp;
      // FIXME: fix this code to be readable and simple
      if (data) {
        try {
          resp = JSON.parse(data);
        } catch {
          return data;
        }
      }

      if (!resp) {
        throw resp;
      }

      return resp;
    },
  ],
});

client.interceptors.request.use(
  config => {
    const token = getToken();

    if (token) config.headers.Authorization = token;

    return config;
  },
  err => Promise.reject(err)
);

export default client;
