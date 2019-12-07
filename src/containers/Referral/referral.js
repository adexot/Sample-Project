import React, { useCallback, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLoads } from 'react-loads';
import styles from './referral.module.scss';
import {
  MobileTab,
  ListAction,
  AgentCard,
  InviteForm,
  renderStatus
} from './referral.component';
import Table from 'components/Table';
import ButtonList from 'components/ButtonList';
import { getReferrals } from 'services/referral';
import { generateDate, isNotEmptyArray } from 'libs';
import Shimmer from 'components/Shimmer';
import DateButton from 'components/DateButton';
import * as moment from 'moment';

const PageLayout = ({ children }) => {
  return (
    <div className={styles.referral}>
      {isMobile && <MobileTab />}
      {children}
    </div>
  );
};

const Referral = () => {
  const [page, setPage] = useState(0);
  const [filteredBy, setFilteredBy] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);

  const referrals = useCallback(() => {
    const result = getReferrals({ page });
    return result;
  }, [page]);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(
    referrals,
    { defer: false },
    [page]
  );

  let filteredData = null;
  let dateFilterLabel = '';

  if (dateFilter) {
    const { startDate, endDate } = dateFilter;
    filteredData = response.filter(item => {
      const itemDate = moment(item.referralDate).unix();
      return itemDate >= startDate && itemDate <= endDate;
    });

    dateFilterLabel = `${moment
      .unix(startDate)
      .format('DD MMM')} - ${moment.unix(endDate).format('DD MMM YY')}`;
  } else if (filteredBy && filteredBy !== 'all') {
    filteredData = response.filter(
      item => item.referralStatus.toLowerCase() === filteredBy
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
    <PageLayout>
      {isMobile && (
        <ListAction
          selectValue={setFilteredBy}
          currentValue={filteredBy}
          callbackFn={setDateFilter}
          label={dateFilterLabel}
        />
      )}
      {isMobile && isPending && <Shimmer variant="card" />}
      {isMobile && isResolved && isNotEmptyArray(actualData) && (
        <div className={styles.agentList}>
          {actualData.map(item => (
            <AgentCard key={item.id} item={item} />
          ))}
        </div>
      )}
      {!isMobile && (
        <div className={styles.referralFlex}>
          <div className={styles.inviteColumn}>
            <div className={styles.inviteColumnHeader}>Invite an Agent</div>
            <div className={styles.inviteColumnContent}>
              <InviteForm />
            </div>
          </div>
          <div className={styles.listColumn}>
            {isPending && <Shimmer variant="referrals" />}
            {isResolved && (
              <>
                <div className={styles.listColumnHeader}>
                  <div className={styles.listTitle}>Total Invitations</div>
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
                          data-active={filteredBy === 'pending'}
                          onClick={() => setFilteredBy('pending')}
                        >
                          Pending
                        </li>
                        <li
                          data-active={filteredBy === 'registered'}
                          onClick={() => setFilteredBy('registered')}
                        >
                          Registered
                        </li>
                        <li
                          data-active={filteredBy === 'active'}
                          onClick={() => setFilteredBy('active')}
                        >
                          Active
                        </li>
                      </ButtonList>
                    </div>
                  </div>
                </div>
                <div className={styles.listColumnContent}>
                  <Table
                    head={['Date', 'Full Name', 'Wallet Number', 'Status']}
                    tableStyle={styles.listTable}
                    renderRow={() =>
                      isNotEmptyArray(actualData) &&
                      actualData.reverse().map(item => (
                        <tr key={item.id}>
                          <td>{generateDate(item.referralDate)}</td>
                          <td>{item.referredAgentName}</td>
                          <td>{item.referredPhone}</td>
                          <td>{renderStatus(item.referralStatus)}</td>
                        </tr>
                      ))
                    }
                  />
                </div>
              </>
            )}
            {isRejected && <div>Failed</div>}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export const Invite = () => {
  return (
    <PageLayout>
      <div className={styles.invite}>
        <InviteForm />
      </div>
    </PageLayout>
  );
};

export default Referral;
