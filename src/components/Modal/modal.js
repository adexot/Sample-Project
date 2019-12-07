import React, { useContext } from 'react';
import { ModalContext } from 'context';
import { isMobile } from 'react-device-detect';
import styles from './modal.module.scss';
import { CaretLeft, Close } from 'assets/svg';
import { composeClasses } from 'libs';

const Modal = ({
  component: Component,
  title,
  fullModal,
  modalContentStyle,
  headerStyle,
  position,
  data,
  useFooter,
  type,
  disableBackdropClick
}) => {
  const { setModalState } = useContext(ModalContext);

  const closeModalHandler = () => {
    setModalState({
      visible: false
    });
  };

  let mobileModatStyle;

  switch (type) {
    case 'filter':
      mobileModatStyle = styles.filterModal;
      break;
    case 'intro':
      mobileModatStyle = styles.introModal;
      break;
    default:
      mobileModatStyle = styles.mobileModal;
      break;
  }
  return (
    <div className={styles.modal}>
      <div
        className={styles.modalBackDrop}
        onClick={() => (disableBackdropClick ? null : closeModalHandler())}
      />
      {isMobile && !fullModal ? (
        <div className={mobileModatStyle}>
          {title && (
            <header
              className={composeClasses(styles.modalHeader, headerStyle || '')}
            >
              {type === 'filter' ? (
                <Close onClick={closeModalHandler} />
              ) : (
                <CaretLeft onClick={closeModalHandler} />
              )}
              {title}
            </header>
          )}
          <div className={styles.mobileModalContent}>
            {Component && (
              <Component data={data} closeFn={() => closeModalHandler()} />
            )}
          </div>
        </div>
      ) : (
        <div
          className={composeClasses(
            styles.desktopModal,
            position === 'center' && styles.center
          )}
        >
          {title && (
            <header
              className={composeClasses(styles.modalHeader, headerStyle || '')}
            >
              {title}
            </header>
          )}
          <div
            className={
              (!fullModal && modalContentStyle) || styles.desktopModalContent
            }
          >
            {Component && (
              <Component data={data} closeFn={() => closeModalHandler()} />
            )}
          </div>
          {useFooter && (
            <div className={styles.modalFooter}>
              {' '}
              <button
                className={styles.cancelButton}
                onClick={closeModalHandler}
              >
                <Close />
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Modal;
