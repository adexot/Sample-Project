import React, { useState, Fragment } from 'react';
import { isMobile } from 'react-device-detect';
import styles from './calendarModal.module.scss';
import { CaretRight } from 'assets/svg';
import * as moment from 'moment';
import { serializeForm, composeClasses } from 'libs';

const CalendarModal = ({ closeFn, callbackFn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState(null);

  const toggleIsOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setFilterType(null);
    } else {
      setIsOpen(true);
      setFilterType('custom');
    }
  };

  const applyDateFilter = e => {
    e.preventDefault();
    e.persist();

    let filterObject = null;

    switch (filterType) {
      case 'custom':
        const { startDate, endDate } = serializeForm(e.target);
        filterObject = {
          startDate: moment(startDate).unix(),
          endDate: moment(endDate).unix()
        };
        break;
      case 'today':
        const time = moment();
        filterObject = {
          startDate: time,
          endDate: time
        };
        break;
      case 'lastSevenDays':
        filterObject = {
          startDate: moment().subtract(6, 'days'),
          endDate: moment()
        };
        break;
      case 'thisMonth':
        filterObject = {
          startDate: moment().startOf('month'),
          endDate: moment().endOf('month')
        };
        break;
      default:
        break;
    }

    callbackFn(filterObject);
    closeFn();
  };

  const dateInstance = moment();
  const sevenDaysAgo = moment().subtract(7, 'days');
  const today = dateInstance.format('dddd - DD MMM YY');
  const thisMonth = dateInstance.format('MMMM YYYY');
  const lastSevenDays = `${sevenDaysAgo.format(
    'DD MMM'
  )} - ${dateInstance.format('DD MMM YY')}`;

  return (
    <div className={styles.calendarModal}>
      <form action="" onSubmit={applyDateFilter}>
        <label
          htmlFor="custom"
          className={composeClasses(styles.bordered, styles.block)}
        >
          <div className={styles.flexContainer}>
            <div>
              <input
                type="radio"
                name="calendarFilter"
                value="custom"
                id="custom"
                onClick={toggleIsOpen}
              />
              <span className={styles.calendarModalLabel}>Choose Date</span>
            </div>
            <div className={styles.calendarModalButton}>
              <CaretRight
                className={isOpen ? styles.arrowUp : styles.arrowDown}
              />
            </div>
          </div>
          {isOpen && (
            <Fragment>
              <div className={styles.subItem}>
                <span htmlFor="">From:</span>
                <input
                  type="date"
                  name="startDate"
                  required={filterType === 'custom'}
                />
              </div>
              <div className={styles.subItem}>
                <span htmlFor="">To:</span>
                <input
                  type="date"
                  name="endDate"
                  required={filterType === 'custom'}
                />
              </div>
            </Fragment>
          )}
        </label>
        <label htmlFor="today" className={styles.calendarModalItem}>
          <div>
            <input
              type="radio"
              name="calendarFilter"
              value="today"
              id="today"
              onClick={() => setFilterType('today')}
            />
            <span className={styles.calendarModalLabel}>Today</span>
          </div>
          <div className={styles.calendarModalButton}>{today}</div>
        </label>
        <label htmlFor="lastSevenDays" className={styles.calendarModalItem}>
          <div>
            <input
              type="radio"
              name="calendarFilter"
              value="lastSevenDays"
              id="lastSevenDays"
              onClick={() => setFilterType('lastSevenDays')}
            />
            <span className={styles.calendarModalLabel}>Last 7 Days</span>
          </div>
          <div className={styles.calendarModalButton}>{lastSevenDays}</div>
        </label>
        <label htmlFor="thisMonth" className={styles.calendarModalItem}>
          <div>
            <input
              type="radio"
              name="calendarFilter"
              value="thisMonth"
              id="thisMonth"
              onClick={() => setFilterType('thisMonth')}
            />
            <span className={styles.calendarModalLabel}>This Month</span>
          </div>
          <div className={styles.calendarModalButton}>{thisMonth}</div>
        </label>
        <div className={styles.calendarModalAction}>
          <button type="submit" className={styles.submitButton}>
            Apply Filter
            <CaretRight />
          </button>
          {!isMobile && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={closeFn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CalendarModal;
