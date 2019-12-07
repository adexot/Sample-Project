import React from 'react';
import styles from './button.module.scss';
import { composeClasses } from 'libs';
import { Spin } from '../../assets/svg';

const Button = ({
  text,
  type = 'button',
  icon: Icon,
  buttonClass = '',
  clickHandler,
  loading
}) => (
  <button
    className={composeClasses(styles.button, buttonClass)}
    onClick={clickHandler}
    type={type}
  >
    {text}
    {loading ? <Spin /> : Icon && <Icon />}
  </button>
);

export default Button;
