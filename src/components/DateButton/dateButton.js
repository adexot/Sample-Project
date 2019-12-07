import React, { useContext } from 'react';
import styles from './dateButton.module.scss';
import { ModalContext } from 'context';
import CalendarModal from 'components/CalendarModal';
import { Calendar } from 'assets/svg';

const DateButton = ({ callbackFn, label = '' }) => {
  const { setModalState } = useContext(ModalContext);

  const openModal = () => {
    setModalState({
      visible: true,
      component: ({ closeFn }) => (
        <CalendarModal callbackFn={callbackFn} closeFn={closeFn} />
      ),
      title: 'Select Date',
      type: 'filter'
    });
  };

  return (
    <button className={styles.dateRangeButton} onClick={() => openModal()}>
      <Calendar />
      <span>{label}</span>
    </button>
  );
};

export default DateButton;
