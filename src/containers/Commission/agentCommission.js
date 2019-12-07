import React, { useState, useContext, useReducer, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Eye, ViewMoreLoader } from 'assets/svg';
import Table from 'components/Table';
import ButtonList from 'components/ButtonList';
import styles from './commission.module.scss';
import {
  PageLayout,
  TransactionsListAction,
  AgentCard,
  Action
} from './commission.component';
import DateButton from 'components/DateButton';
import { getAgentCommission } from 'services/commission';
import Shimmer from 'components/Shimmer';
import { isNotEmptyArray, generateAmount } from 'libs';
import * as moment from 'moment';
import { UserContext } from 'context';

const ParamsReducer = (params, { type, payload }) => {
  switch (type) {
    case 'UPDATE_ORDER':
      return {
        ...params,
        page: 0,
        order: payload
      };
    case 'UPDATE_PAGE':
      return {
        ...params,
        page: payload
      };
    case 'UPDATE_DATE':
      console.log(payload);
      return {
        ...params,
        page: 0,
        startDate:
          payload && moment(payload.startDate * 1000).format('YYYY-MM-DD'),
        endDate: payload && moment(payload.endDate * 1000).format('YYYY-MM-DD')
      };
    default:
      return params;
  }
};

const AgentCommission = () => {
  const {
    data: {
      agent: { secondaryUid }
    }
  } = useContext(UserContext);
  const [sortValue, setSortValue] = useState('highest');
  const [isPending, setIsPending] = useState(true);
  const [isViewMore, setIsViewMore] = useState(false);
  const [params, setParams] = useReducer(ParamsReducer, {
    page: 0,
    order: 'desc',
    startDate: null,
    endDate: null,
    limit: 15
  });
  const [responseData, setResponseData] = useState([]);
  const [currentResponse, setCurrentResponse] = useState([]);
  useEffect(() => {
    if (secondaryUid) {
      setIsPending(params.page === 0 ? true : false);
      setIsViewMore(true);
      getAgentCommission(secondaryUid, params)
        .then(response => {
          setCurrentResponse(response);
          if (params.page === 0) {
            setIsPending(false);
            setIsViewMore(false);
            setResponseData(response);
          } else {
            setIsPending(false);
            setIsViewMore(false);
            setResponseData([...responseData, ...response]);
          }
        })
        .catch(e => {
          setIsPending(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, secondaryUid]);

  let dateFilterLabel = '';
  if (params.startDate) {
    const { startDate, endDate } = params;
    dateFilterLabel = `${moment(startDate).format('DD MMM')} - ${moment(
      endDate
    ).format('DD MMM YY')}`;
  } else {
    dateFilterLabel = `${moment()
      .startOf('month')
      .format('DD MMM')} - ${moment().format('DD MMM YY')}`;
  }

  return (
    <PageLayout>
      {isMobile && (
        <TransactionsListAction
          selectValue={setSortValue}
          currentValue={sortValue}
          callbackFn={dateObject => {
            setParams({
              type: 'UPDATE_DATE',
              payload: dateObject
            });
          }}
          label={dateFilterLabel}
        />
      )}
      {isPending && isMobile && <Shimmer variant="referrals" />}
      {isNotEmptyArray(responseData) && isMobile && (
        <div className={styles.agentList}>
          {responseData.map((item, i) => (
            <AgentCard key={`${item.id}${i}`} item={item} />
          ))}

          {currentResponse &&
            (currentResponse.length === params.limit ||
              currentResponse.length > params.limit) && (
              <div className={styles.bottomBar}>
                <button
                  className={styles.viewAll}
                  onClick={() =>
                    setParams({
                      type: 'UPDATE_PAGE',
                      payload: params.page + 1
                    })
                  }
                >
                  {isViewMore ? (
                    <ViewMoreLoader />
                  ) : (
                    <>
                      <Eye />
                      View All Transactions
                    </>
                  )}
                </button>
              </div>
            )}
        </div>
      )}
      {!isMobile && (
        <div className={styles.commissionFlex}>
          <div className={styles.listColumn}>
            <div className={styles.listColumnHeader}>
              <div className={styles.listTitle}>
                Agent Transaction Commissions
              </div>
              <div className={styles.listAction}>
                <div className={styles.dateRange}>
                  <DateButton
                    callbackFn={dateObject => {
                      setParams({
                        type: 'UPDATE_DATE',
                        payload: dateObject
                      });
                    }}
                    label={dateFilterLabel}
                  />
                </div>
                <div className={styles.ll}>
                  <ButtonList>
                    <li
                      data-active={!sortValue || sortValue === 'highest'}
                      onClick={() => {
                        setSortValue('highest');
                        return setParams({
                          type: 'UPDATE_ORDER',
                          payload: 'desc'
                        });
                      }}
                    >
                      Highest
                    </li>
                    <li
                      data-active={sortValue === 'lowest'}
                      onClick={() => {
                        setSortValue('lowest');
                        return setParams({
                          type: 'UPDATE_ORDER',
                          payload: 'asc'
                        });
                      }}
                    >
                      Lowest
                    </li>
                  </ButtonList>
                </div>
              </div>
            </div>
            {isPending && <Shimmer variant="referrals" />}
            {!isPending && isNotEmptyArray(responseData) && (
              <div className={styles.listColumnContent}>
                <Table
                  head={[
                    'FullName',
                    'Wallet Number',
                    'Transfer Commission(₦)',
                    'Withdrawal Commission (₦)',
                    'Bill Payment Commission (₦)',
                    'Total Commission (₦)',
                    ''
                  ]}
                  tableStyle={styles.listTable}
                  renderRow={() =>
                    isNotEmptyArray(responseData) &&
                    responseData.map((item, i) => (
                      <tr key={`${item.id}${i}`}>
                        <td>{item.name.toUpperCase()}</td>
                        <td>{item.phone}</td>
                        <td>{generateAmount(item.totalTransfersCommission)}</td>
                        <td>
                          {generateAmount(item.totalWithdrawalCommission)}
                        </td>
                        <td>{generateAmount(item.totalBillsCommission)}</td>
                        <td>
                          {generateAmount(
                            item.totalWithdrawalCommission +
                              item.totalTransfersCommission +
                              item.totalBillsCommission
                          )}
                        </td>
                        <td className={styles.action}>
                          <Action item={item} />
                        </td>
                      </tr>
                    ))
                  }
                />

                {currentResponse &&
                  (currentResponse.length === params.limit ||
                    currentResponse.length > params.limit) && (
                    <div className={styles.bottomBar}>
                      <button
                        className={styles.viewAll}
                        onClick={() =>
                          setParams({
                            type: 'UPDATE_PAGE',
                            payload: params.page + 1
                          })
                        }
                      >
                        {isViewMore ? (
                          <ViewMoreLoader />
                        ) : (
                          <>
                            <Eye />
                            View All Transactions
                          </>
                        )}
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

export default AgentCommission;
