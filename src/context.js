import React from 'react';

export const UserContext = React.createContext({
  data: {},
  isLoggedIn: false,
  logout: () => {},
  updateUser: user => {},
});

export const ModalContext = React.createContext({
  visible: false,
  title: '',
  component: null,
  fullModal: false,
  modalContentStyle: null,
  setModalState: () => {},
});
