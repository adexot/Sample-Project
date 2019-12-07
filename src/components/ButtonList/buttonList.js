import React from 'react';
import styles from './buttonList.module.scss';

const ButtonList = ({ children }) => {
  return <ul className={styles.buttonList}>{children}</ul>;
};

export default ButtonList;
