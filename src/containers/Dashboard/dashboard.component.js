import React, { useContext, useState, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { useLoads } from 'react-loads';
import { Link } from 'react-router-dom';
import NavItem from 'components/NavItem';
import styles from './dashboard.module.scss';
import Button from 'components/Button';
import {
  composeClasses,
  isNotEmptyArray,
  generateAmount,
  serializeForm,
  generateDate
} from 'libs';
import {
  Eye,
  CaretRight,
  Clock,
  Asterisk,
  Close,
  Wallet,
  Vault
} from 'assets/svg';
import { ModalContext } from 'context';
import Input from 'components/Input';
import Tab from 'components/Tab';
import SortModal from 'components/SortModal';
import { getCommissionWallet, cashOutToWallet } from 'services/commission';
import {
  SuccessfulTopUp,
  FailedTopUp
} from '../../components/DashboardLayout/dashboardLayout.component';
import DateButton from 'components/DateButton';

const tabData = [
  {
    to: '/dashboard',
    title: 'Commissions'
  },
  {
    to: '/outlets',
    title: 'My Outlets'
  }
];

export const PageTab = () => {
  return (
    <ul className={styles.pageTab}>
      {isNotEmptyArray(tabData) &&
        tabData.map((item, key) => (
          <NavItem
            activeClassName={styles.tabActive}
            className={styles.tabItem}
            to={item.to}
            key={key}
          >
            {item.title}
          </NavItem>
        ))}
    </ul>
  );
};

export const PageLayout = ({ children }) => {
  return (
    <div className={styles.commission}>
      {/* isMobile && <PageTab /> */}
      {children}
    </div>
  );
};

const WithdrawCommissions = ({ closeFn, data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [
    {
      id: 0,
      title: 'To Kudi Wallet',
      icon: <Wallet />,
      component: <CommissionsToWallet walletBalance={data} closeFn={closeFn} />
    }
    // {
    //   id: 1,
    //   title: 'To Bank Account',
    //   icon: <Vault />,
    //   component: (
    //     <CommissionsToBankAccount walletBalance={data} closeFn={closeFn} />
    //   )
    // }
  ];

  const setTabToActive = id => {
    setActiveTab(id);
  };

  return (
    <div>
      <ul className={styles.withdrawTab}>
        {tabData.map(item => (
          <Tab
            key={item.id}
            isActive={item.id === activeTab}
            clickHandler={() => setTabToActive(item.id)}
          >
            {item.icon}
            {item.title}
          </Tab>
        ))}
      </ul>

      <div className={styles.withdrawTotal}>
        Your Total Commissions - &#8358;{generateAmount(data)}
      </div>
      <div className={styles.withdrawBody}>{tabData[activeTab].component}</div>
    </div>
  );
};

const CommissionsToBankAccount = ({ closeFn }) => (
  <form action="">
    <Input
      type="number"
      name="amount"
      className={styles.input}
      label="Amount"
      htmlFor="amount"
      error={null}
      labelIcon={<Asterisk />}
    />
    <Input
      type="text"
      name="account_number"
      className={styles.input}
      label="Account Number"
      htmlFor="account_number"
      error={null}
      labelIcon={<Asterisk />}
    />
    <Input
      type="text"
      name="bank_name"
      className={styles.input}
      label="Bank Name"
      htmlFor="bank_name"
      error={null}
      labelIcon={<Asterisk />}
    />
    <Input
      type="text"
      name="account_name"
      className={styles.input}
      htmlFor="acount_name"
      value="Tester Tester"
      disabled
    />
    <div className={styles.withdrawAction}>
      <Button
        text="Withdraw"
        type="submit"
        icon={CaretRight}
        buttonClass={styles.submitButton}
      />
      {!isMobile && (
        <button className={styles.cancelButton} type="button" onClick={closeFn}>
          <Close />
          Cancel
        </button>
      )}
    </div>
  </form>
);

const CommissionsToWallet = ({ closeFn, walletBalance }) => {
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setModalState } = useContext(ModalContext);

  const handleCashout = async e => {
    e.preventDefault();
    e.persist();
    setLoading(true);

    const formData = serializeForm(e.target);

    if (!formData.amount) {
      setLoading(false);
      return setFormError('Please provide an amount');
    }

    if (walletBalance < formData.amount) {
      setLoading(false);
      return setFormError('Insufficient wallet alance');
    }

    const cashOutData = {
      amount: formData.amount
    };

    return await cashOutToWallet(cashOutData)
      .then(({ data, status, message }) => {
        if (status)
          return setModalState({
            visible: true,
            component: SuccessfulTopUp,
            data: data.amount || 0
          });
        if (!status) throw new Error(message);
      })
      .catch(err => {
        return setModalState({
          visible: true,
          component: FailedTopUp
        });
      });
  };
  return (
    <form action="" onSubmit={handleCashout}>
      <Input
        type="number"
        name="amount"
        className={styles.input}
        label="Amount"
        htmlFor="amount"
        error={formError || null}
        labelIcon={<Asterisk />}
        disabled={!walletBalance}
      />
      <div className={styles.withdrawAction}>
        <Button
          text="Withdraw"
          type="submit"
          icon={CaretRight}
          buttonClass={styles.submitButton}
          disabled={!!walletBalance}
          loading={loading}
        />
        {!isMobile && (
          <button
            className={styles.cancelButton}
            type="button"
            onClick={closeFn}
          >
            <Close />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export const CommisionColumn = () => {
  const { setModalState } = useContext(ModalContext);

  const walletDetails = useCallback(() => getCommissionWallet(), []);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(
    walletDetails,
    { defer: false }
  );

  const showModal = () => {
    return setModalState({
      visible: true,
      component: WithdrawCommissions,
      title: 'Withdraw Commissions',
      modalContentStyle: styles.withdrawContent,
      headerStyle: styles.withdrawHeader,
      data: isResolved && response ? response.walletBalance : 0,
      disableBackdropClick: true
    });
  };

  return (
    <div className={styles.dashboardCards}>
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardCardHeader}>Available commission</div>
        <div className={styles.dashboardCardContent}>
          <div className={styles.cash}>
            &#8358;
            {generateAmount(
              isResolved && response ? response.walletBalance : 0
            )}
          </div>
          <Button
            buttonClass={styles.buttonClass}
            text="Cash out Commissions"
            icon={CaretRight}
            clickHandler={() => showModal()}
          />
        </div>
        <div className={styles.dashboardCardFooter}>
          <Link to="/commission-wallet-history" className={styles.linkClass}>
            <Clock />
            Commission Wallet History
          </Link>
        </div>
      </div>
      <div className={styles.dashboardCard}>
        <div className={styles.dashboardCardHeader}>commissions Earned On</div>
        <div
          className={composeClasses(
            styles.dashboardCardContent,
            styles.borderBottom
          )}
        >
          <p className={styles.textMedium}>Agent Onboarding</p>
          <div className={composeClasses(styles.cash, styles.greyed)}>
            &#8358;
            {
              /*generateAmount(
              isResolved && response ? response.monthOnboardingCommission : 0
            )*/ 0
            }
          </div>
        </div>
        <div className={styles.dashboardCardContent}>
          <p className={styles.textMedium}>Agent Transactions</p>
          <div className={composeClasses(styles.cash, styles.greyed)}>
            &#8358;
            {
              /*generateAmount(
              isResolved && response  ? response.monthTransactionCommission : 0
            )*/ 0
            }
          </div>
        </div>
        <div className={styles.dashboardCardFooter}>
          Total Commission - &#8358;
          {
            /*generateAmount(
            isResolved && response 
              ? response.monthOnboardingCommission +
                  response.monthTransactionCommission
              : 0
          )*/ 0
          }
        </div>
      </div>
    </div>
  );
};

export const MobileChart = () => {
  return (
    <div className={styles.mobileChart}>
      <div className={composeClasses(styles.listTitle, styles.textMedium)}>
        Commissions Earned on Outlet Transactions
      </div>
      <div className={styles.mobileChartContainer} />
    </div>
  );
};

export const ListAction = ({
  selectValue,
  currentValue,
  callbackFn,
  label
}) => {
  const { setModalState } = useContext(ModalContext);

  const sortActions = [
    {
      title: 'All',
      value: 'all'
    },
    {
      title: 'Wallet',
      value: 'wallet'
    },
    {
      title: 'Bank Account',
      value: 'bank'
    }
  ];

  const openModal = () => {
    setModalState({
      visible: true,
      component: ({ closeFn }) => {
        return (
          <SortModal
            actionList={sortActions}
            closeFn={closeFn}
            selectValue={selectValue}
            currentValue={currentValue}
          />
        );
      },
      title: 'Select Channel',
      type: 'filter'
    });
  };
  const currentValueIndex = sortActions.findIndex(
    item => item.value === currentValue
  );
  return (
    <div className={styles.listAction}>
      <DateButton callbackFn={callbackFn} label={label} />
      <button className={styles.inviteFilterButton} onClick={() => openModal()}>
        <span>
          {currentValue === 'all'
            ? 'All'
            : sortActions[currentValueIndex].title}
        </span>
        <CaretRight />
      </button>
    </div>
  );
};

export const RenderAction = ({ data }) => {
  const { setModalState } = useContext(ModalContext);

  const openModal = () => {
    setModalState({
      visible: true,
      component: ActionModal,
      title: 'Cash Out',
      data,
      useFooter: true
    });
  };
  return isMobile ? (
    <button
      onClick={e => {
        e.preventDefault();
        openModal();
      }}
      className={styles.actionButton}
    >
      <Eye />
      View Transaction
    </button>
  ) : (
    <div onClick={openModal}>
      <Eye />
      <span>View</span>
    </div>
  );
};

const ActionModal = ({ data: item }) => {
  return (
    <div className={styles.cashOutdetail}>
      <div className={styles.row}>
        <div className={styles.title}>Date</div>
        <div className={styles.value}>{generateDate(item.time_updated)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Previous Balance</div>
        <div className={styles.value}>
          &#8358;
          {item.transaction_type === 'DEBIT'
            ? generateAmount(item.wallet_balance + item.amount)
            : generateAmount(item.wallet_balance - item.amount)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Cash Out Amount</div>
        <div className={styles.value}>&#8358;{generateAmount(item.amount)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Current Balance </div>
        <div className={styles.value}>
          &#8358;{generateAmount(item.wallet_balance)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transaction Type</div>
        <div className={styles.value}>{item.transaction_type}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Reference Id</div>
        <div className={styles.value} />
      </div>
    </div>
  );
};

export const CashOutCard = ({ item }) => {
  return (
    <div className={styles.cashOutCard}>
      <div className={styles.row}>
        <div className={styles.title}>Date</div>
        <div className={styles.value}>{generateDate(item.time_updated)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Previous Balance</div>
        <div className={styles.value}>
          &#8358;
          {item.transaction_type === 'DEBIT'
            ? generateAmount(item.wallet_balance + item.amount)
            : generateAmount(item.wallet_balance - item.amount)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Cash Out Amount</div>
        <div className={styles.value}>&#8358;{generateAmount(item.amount)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Current Balance </div>
        <div className={styles.value}>
          &#8358;{generateAmount(item.wallet_balance)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transaction Type</div>
        <div className={styles.value}>{item.transaction_type}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Reference Id</div>
        <div className={styles.value} />
      </div>
      <RenderAction data={item} />
    </div>
  );
};
