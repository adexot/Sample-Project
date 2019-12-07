import React, { useState, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { Calendar, Eye } from 'assets/svg';
import Table from 'components/Table';
import ButtonList from 'components/ButtonList';
import styles from './dashboard.module.scss';
import { RenderAction, ListAction, CashOutCard } from './dashboard.component';
import { isNotEmptyArray, generateDate, generateAmount } from 'libs';
import { getCommissionHistory } from 'services/commission';
import * as moment from 'moment';
import { useLoads } from 'react-loads';
import Shimmer from 'components/Shimmer';
import DateButton from 'components/DateButton';

const CashOutHistory = props => {
  const [filteredBy, setFilteredBy] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);

  const referrals = useCallback(() => {
    const result = getCommissionHistory();
    return result;
  }, []);
  let { response, error, load, isRejected, isPending, isResolved } = useLoads(
    referrals,
    { defer: false }
  );

  response =
    isResolved && response
      ? response
          .filter(item => item.status === 'SUCCESS')
          .map(item => ({ ...item, channel: 'Wallet' }))
      : response;

  let filteredData = null;
  let dateFilterLabel = '';

  if (dateFilter) {
    const { startDate, endDate } = dateFilter;
    filteredData = response.filter(item => {
      const itemDate = moment(item.time_updated).unix();
      return itemDate >= startDate && itemDate <= endDate;
    });

    dateFilterLabel = `${moment
      .unix(startDate)
      .format('DD MMM')} - ${moment.unix(endDate).format('DD MMM YY')}`;
  } else if (filteredBy && filteredBy !== 'all') {
    filteredData = response.filter(
      item => item.channel.toLowerCase() === filteredBy
    );
  }

  // set default label for DateButton
  if (!dateFilter)
    dateFilterLabel = `${moment()
      .startOf('month')
      .format('DD MMM')} - ${moment().format('DD MMM YY')}`;

  const actualData =
    dateFilter || (filteredBy && filteredBy !== 'all')
      ? filteredData
      : response;
  return (
    <div className={styles.cashOutHistory}>
      {isMobile && (
        <ListAction
          selectValue={setFilteredBy}
          currentValue={filteredBy}
          callbackFn={setDateFilter}
          label={dateFilterLabel}
        />
      )}
      {isMobile && isPending && <Shimmer variant="card" />}
      {isNotEmptyArray(actualData) && isMobile && (
        <div className={styles.cashOutList}>
          {actualData.map((item, i) => (
            <CashOutCard key={i} item={item} />
          ))}
        </div>
      )}
      {!isMobile && (
        <div className={styles.cashOutHistoryFlex}>
          <div className={styles.listColumn}>
            {isPending && <Shimmer variant="referrals" />}
            {isResolved && (
              <>
                <div className={styles.listColumnHeader}>
                  <div className={styles.listTitle}>
                    Commission Wallet History
                  </div>
                  <div className={styles.listAction}>
                    <div className={styles.dateRange}>
                      <DateButton
                        callbackFn={setDateFilter}
                        label={dateFilterLabel}
                      />
                    </div>
                    <div className={styles.ll}>
                      <ButtonList>
                        <li data-active>All</li>
                        <li>Wallet</li>
                        <li>Bank Account</li>
                      </ButtonList>
                    </div>
                  </div>
                </div>
                <div className={styles.listColumnContent}>
                  <Table
                    head={[
                      'Date',
                      'Previous Balance',
                      'Amount',
                      'Current Balance',
                      'Transaction Type',
                      'Reference Id',
                      ''
                    ]}
                    tableStyle={styles.listTable}
                    renderRow={() =>
                      isNotEmptyArray(actualData) &&
                      actualData.map((item, i) => (
                        <tr key={i}>
                          <td>{generateDate(item.time_updated)}</td>
                          <td>
                            &#8358;
                            {item.transaction_type === 'DEBIT'
                              ? generateAmount(
                                  item.wallet_balance + item.amount
                                )
                              : generateAmount(
                                  item.wallet_balance - item.amount
                                )}
                          </td>
                          <td> &#8358;{generateAmount(item.amount)}</td>
                          <td> &#8358;{generateAmount(item.wallet_balance)}</td>
                          <td className={styles.transactionType}>
                            {item.transaction_type}
                          </td>
                          <td />
                          <td className={styles.action}>
                            <RenderAction data={item} />
                          </td>
                        </tr>
                      ))
                    }
                  />
                  {/* <div className={styles.bottomBar}>
                    <button className={styles.viewAll}>
                      <Eye />
                      View All Transactions
                    </button>
                  </div> */}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashOutHistory;
