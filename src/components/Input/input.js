import React from 'react';
import { InputError } from '../../assets/svg';
import { composeClasses } from '../../libs';
import styles from './input.module.scss';

const Input = ({
  htmlFor,
  type,
  name,
  className,
  placeholder,
  labelStyle = '',
  label,
  inputStyle,
  error,
  labelIcon,
  ...props
}) => {
  return (
    <div className={styles.inputBox}>
      <div
        className={composeClasses(
          inputStyle || styles.inputGroup,
          error && styles.errorState
        )}
      >
        <input
          type={type}
          name={name}
          id={htmlFor}
          className={composeClasses(styles.input, className)}
          placeholder={placeholder || ' '}
          {...props}
        />
        <label
          className={composeClasses(styles.inputLabel, labelStyle)}
          htmlFor={htmlFor || ''}
        >
          {label || ''}
          {labelIcon || ''}
        </label>
        {error && <InputError />}
      </div>
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  );
};

export default Input;
