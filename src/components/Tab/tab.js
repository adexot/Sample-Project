import React from 'react';
import styles from './tab.module.scss';
import { composeClasses } from 'libs';

const Tab = ({ children, isActive, clickHandler }) => {
  return (
    <li
      className={composeClasses(styles.tab, isActive && styles.active)}
      onClick={clickHandler}
    >
      {children}
    </li>
  );
};

export default Tab;
