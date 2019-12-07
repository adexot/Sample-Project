import React from 'react';
import styles from './sortModal.module.scss';
import { CaretRight } from 'assets/svg';

const SortModal = ({ actionList, selectValue, closeFn, currentValue }) => {
  return (
    <>
      <ul>
        {actionList.map((action, index) => (
          <li className={styles.sortActionItem} key={index}>
            <input
              type="radio"
              name="sortAction"
              id={action.value}
              value={action.value}
              onClick={() => selectValue(action.value)}
              defaultChecked={currentValue === action.value}
            />
            <label
              className={styles.sortActionItemLabel}
              htmlFor={action.value}
            >
              {action.title}
            </label>
          </li>
        ))}
      </ul>
      <div className={styles.sortModalAction}>
        <button type="submit" className={styles.submitButton} onClick={closeFn}>
          Apply Filter
          <CaretRight />
        </button>
      </div>
    </>
  );
};

export default SortModal;
