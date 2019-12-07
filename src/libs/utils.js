import { max } from 'moment';

export const composeClasses = (...styles) => {
  let classes = '';

  styles.forEach(arg => {
    if (arg) classes += `${arg} `;
  });

  return classes.trim();
};

export const isNotEmptyArray = arr => Array.isArray(arr) && arr.length > 0;

/**
 * Checks if an object has no set properties
 * @param {*} obj The object to test
 * @returns {*} boolean
 */
export const isObjectEmpty = (obj = {}) =>
  !obj || Object.keys(obj).length === 0;

/**
 * wrapper around the native localStorage to make it more flexible
 */
export const localStore = {
  set: (key, value, isObject = false) => {
    localStorage.setItem(key, isObject ? JSON.stringify(value) : value);
  },
  get: (key, isObject = false) => {
    const value = localStorage.getItem(key);
    let result = null;
    if (value) result = isObject ? JSON.parse(value) : value;
    return result;
  },
  remove: key => {
    localStorage.removeItem(key);
  }
};

export const generateDate = timestamp => {
  let result = '';
  if (timestamp) {
    const dateObj = new Date(timestamp);
    const getDate = dateObj.getDate();
    const getDateString = getDate < 10 ? `0${getDate}` : getDate;
    const getMonthString = new Intl.DateTimeFormat('en-US', {
      month: 'short'
    }).format(dateObj);
    result = `${getDateString} ${getMonthString} ${dateObj.getFullYear()}`;
  }
  return result;
};

export const generateMonthYear = () => {
  const dateObj = new Date();
  const getMonthString = new Intl.DateTimeFormat('en-US', {
    month: 'long'
  }).format(dateObj);
  return `${getMonthString} ${dateObj.getFullYear()}`;
};

export const truncateString = (string, maxLength) => {
  if (string.length > maxLength) return `${string.substring(0, maxLength)}...`;
  return string;
};

export const generateAmount = num =>
  num ? num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0.0;

export const formatNumber = num => (num ? num.toLocaleString() : 0);
