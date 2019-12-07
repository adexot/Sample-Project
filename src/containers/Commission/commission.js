import React, { useCallback, useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLoads } from 'react-loads';
import { Eye } from 'assets/svg';
import Table from 'components/Table';
import ButtonList from 'components/ButtonList';
import styles from './commission.module.scss';
import {
  PageLayout,
  ListAction,
  OnboardCard,
  renderTarget,
  IntroModal
} from './commission.component';
import { getOnboarding } from 'services/commission';
import Shimmer from 'components/Shimmer';
import { isNotEmptyArray, generateDate, localStore } from 'libs';
import { ModalContext } from 'context';
import DateButton from 'components/DateButton';
import * as moment from 'moment';

// const apiData = [
//   {
//     id: 1,
//     date: '02 Mar 19',
//     fullName: 'Firstname Lastname',
//     walletNumber: '07023456789',
//     transaction: '582',
//     commission: '2000',
//     target: '50'
//   },
//   {
//     id: 2,
//     date: '02 Mar 19',
//     fullName: 'Firstname Lastname',
//     walletNumber: '07023456789',
//     transaction: '582',
//     commission: '2000',
//     target: '20'
//   },
//   {
//     id: 3,
//     date: '02 Mar 19',
//     fullName: 'Firstname Lastname',
//     walletNumber: '07023456789',
//     transaction: '582',
//     commission: '2000',
//     target: '250'
//   },
//   {
//     id: 4,
//     date: '02 Mar 19',
//     fullName: 'Firstname Lastname',
//     walletNumber: '07023456789',
//     transaction: '582',
//     commission: '2000',
//     target: '30'
//   },
//   {
//     id: 5,
//     date: '02 Mar 19',
//     fullName: 'Firstname Lastname',
//     walletNumber: '07023456789',
//     transaction: '582',
//     commission: '2000',
//     target: '50'
//   }
// ];

const Commission = () => {
  const { setModalState } = useContext(ModalContext);
  const [filteredBy, setFilteredBy] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [page, setPage] = useState(0);

  const onboarding = useCallback(() => {
    const result = getOnboarding({ page });
    return result;
  }, [page]);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(
    onboarding,
    { defer: false },
    [page]
  );

  let filteredData = null;
  let dateFilterLabel = '';

  if (dateFilter) {
    const { startDate, endDate } = dateFilter;
    filteredData = response.filter(item => {
      const itemDate = moment(item.startDate).unix();
      return itemDate >= startDate && itemDate <= endDate;
    });

    dateFilterLabel = `${moment
      .unix(startDate)
      .format('DD MMM')} - ${moment.unix(endDate).format('DD MMM YY')}`;
  } else if (filteredBy && filteredBy !== 'all') {
    const threshold = 500;
    switch (filteredBy) {
      case 'high':
        filteredData = response.filter(item => item.transCount > threshold);
        break;
      case 'average':
        filteredData = response.filter(item => item.transCount === threshold);
        break;
      default:
        filteredData = response;
    }
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

  useEffect(() => {
    if (isNotEmptyArray(response) && !localStore.get('shownCommissionIntro')) {
      setModalState({
        visible: true,
        position: 'center',
        component: IntroModal,
        modalContentStyle: styles.introModal,
        headerStyle: styles.introModalHeader,
        type: 'intro'
      });
      localStore.set('shownCommissionIntro', true);
    }
  }, [response, setModalState]);

  return (
    <PageLayout>
      {isMobile && (
        <ListAction
          selectValue={setFilteredBy}
          currentValue={filteredBy}
          callbackFn={setDateFilter}
          label={dateFilterLabel}
        />
      )}
      {isPending && isMobile && <Shimmer variant="referrals" />}
      {isNotEmptyArray(actualData) && isMobile && (
        <div className={styles.agentList}>
          {actualData.map((item, i) => (
            <OnboardCard key={`${item.agentId}${i}`} item={item} />
          ))}
        </div>
      )}
      {!isMobile && (
        <div className={styles.commissionFlex}>
          <div className={styles.listColumn}>
            <div className={styles.listColumnHeader}>
              <div className={styles.listTitle}>
                On-Boarding Transaction Commissions
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
                    <li
                      data-active={!filteredBy || filteredBy === 'all'}
                      onClick={() => setFilteredBy('all')}
                    >
                      All
                    </li>
                    <li
                      data-active={filteredBy === 'high'}
                      onClick={() => setFilteredBy('high')}
                    >
                      First 30 Days
                    </li>
                    <li
                      data-active={filteredBy === 'average'}
                      onClick={() => setFilteredBy('average')}
                    >
                      Last 30 Days
                    </li>
                  </ButtonList>
                </div>
              </div>
            </div>
            {isPending && <Shimmer variant="referrals" />}
            {isResolved && isNotEmptyArray(actualData) && (
              <div className={styles.listColumnContent}>
                <Table
                  head={[
                    'Start Date',
                    'FullName',
                    'Wallet Number',
                    'Transaction Count',
                    'Commission (N)',
                    'Agent Target'
                  ]}
                  tableStyle={styles.listTable}
                  renderRow={() =>
                    isNotEmptyArray(actualData) &&
                    actualData.map((item, i) => (
                      <tr key={`${item.agentId}${i}`}>
                        <td>{generateDate(item.startDate)}</td>
                        <td>{item.fullName}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.transCount}</td>
                        <td>{item.commission}</td>
                        {/* FIXME: api is not providing the agent target */}
                        <td>
                          {renderTarget(item.transCount, item.target || '500')}
                        </td>
                      </tr>
                    ))
                  }
                />
                {actualData.length > 20 && (
                  <div className={styles.bottomBar}>
                    <button className={styles.viewAll}>
                      <Eye />
                      View All Transactions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Commission;
