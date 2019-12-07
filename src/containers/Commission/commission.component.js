import React, { Fragment, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ProgressiveImage from 'react-progressive-image';
import NavItem from 'components/NavItem';
import styles from './commission.module.scss';
import { Bell, Eye, CaretRight, Payout, Check, CaretLeft } from 'assets/svg';
import {
  IntroBannerOne,
  IntroBannerTwo,
  IntroBannerOneTiny,
  IntroBannerTwoTiny
} from 'assets/png';
import { ModalContext } from 'context';
import SortModal from 'components/SortModal';
import Button from 'components/Button';
import DateButton from 'components/DateButton';
import {
  composeClasses,
  isNotEmptyArray,
  generateDate,
  generateAmount,
  formatNumber
} from 'libs';

const tabData = [
  // {
  //   to: '/commissions',
  //   title: 'Onboarding'
  // },
  // {
  //   to: '/commissions/transactions',
  //   title: 'Transactions'
  // }
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
            exact
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
      {isMobile && <PageTab />}
      {children}
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

  const openModal = () => {
    setModalState({
      visible: true,
      component: ({ closeFn }) => {
        const sortActions = [
          {
            title: 'All',
            value: 'all'
          },
          {
            title: 'First 30 Days',
            value: 'high'
          },
          {
            title: 'Last 30 Days',
            value: 'average'
          }
        ];
        return (
          <SortModal
            actionList={sortActions}
            closeFn={closeFn}
            selectValue={selectValue}
            currentValue={currentValue}
          />
        );
      },
      title: 'Select Commission Status',
      type: 'filter'
    });
  };

  const filterMapping = {
    high: 'First 30 Days',
    average: 'Last 30 Days',
    all: 'All'
  };

  return (
    <div className={styles.listAction}>
      <DateButton callbackFn={callbackFn} label={label} />
      <button className={styles.inviteFilterButton} onClick={() => openModal()}>
        <span>{filterMapping[currentValue]}</span>
        <CaretRight />
      </button>
    </div>
  );
};

export const TransactionsListAction = ({
  selectValue,
  currentValue,
  callbackFn,
  label
}) => {
  const { setModalState } = useContext(ModalContext);

  const openModal = () => {
    setModalState({
      visible: true,
      component: ({ closeFn }) => {
        const sortActions = [
          {
            title: 'All',
            value: 'all'
          },
          {
            title: 'Highest',
            value: 'highest'
          },
          {
            title: 'Lowest',
            value: 'lowest'
          }
        ];
        return (
          <SortModal
            actionList={sortActions}
            closeFn={closeFn}
            selectValue={selectValue}
            currentValue={currentValue}
          />
        );
      },
      title: 'Select Commission Status',
      type: 'filter'
    });
  };

  return (
    <div className={styles.listAction}>
      <DateButton callbackFn={callbackFn} label={label} />
      <button className={styles.inviteFilterButton} onClick={() => openModal()}>
        <span>{currentValue}</span>
        <CaretRight />
      </button>
    </div>
  );
};

export const displayTarget = (transactionCount, target) => {
  let targetStyle = styles.low;
  if (transactionCount > target) {
    targetStyle = styles.high;
  }

  return (
    <Fragment>
      <span className={targetStyle}>
        <Payout />
        {target}
      </span>
    </Fragment>
  );
};

export const renderTarget = displayTarget;

export const renderAction = actionId => {
  // FIXME: change this to a switch statement if actionId is not binary
  let action = actionId ? 'Buzz' : 'View';

  return (
    <Fragment>
      {action === 'View' ? <Eye /> : <Bell />}
      <span>{action}</span>
    </Fragment>
  );
};

export const AgentCard = ({ item }) => {
  return (
    <div className={styles.agentCard}>
      <div className={styles.row}>
        <div className={styles.title}>Full Name</div>
        <div className={styles.value}>{item.name}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Wallet Number</div>
        <div className={styles.value}>{item.phone}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transfer Commission</div>
        <div className={styles.value}>
          {generateAmount(item.totalTransfersCommission)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Withdrawal Commission</div>
        <div className={styles.value}>
          {generateAmount(item.totalWithdrawalCommission)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Bill Commission</div>
        <div className={styles.value}>
          {generateAmount(item.totalBillsCommission)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Total Commission</div>
        <div className={styles.value}>
          {generateAmount(
            item.totalWithdrawalCommission +
              item.totalTransfersCommission +
              item.totalBillsCommission
          )}
        </div>
      </div>
      <Action item={item} />
    </div>
  );
};

export const OnboardCard = ({ item }) => {
  return (
    <div className={styles.agentCard}>
      <div className={styles.row}>
        <div className={styles.title}>Date</div>
        <div className={styles.value}>{generateDate(item.startDate)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Full Name</div>
        <div className={styles.value}>{item.fullName}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Wallet Number</div>
        <div className={styles.value}>{item.phoneNumber}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transaction Count</div>
        <div className={styles.value}>{item.transCount}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Commission</div>
        <div className={styles.value}>{item.commission}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Agent Target</div>
        <div className={styles.value}>
          {displayTarget(item.transCount, item.target || '500')}
        </div>
      </div>
    </div>
  );
};

export const IntroModal = ({ closeFn }) => {
  const [intro, setIntro] = useState(1);
  return (
    <Fragment>
      {intro === 1 && (
        <div className={styles.introModal}>
          <ProgressiveImage
            src={IntroBannerOne}
            placeholder={IntroBannerOneTiny}
          >
            {src => (
              <img className={styles.introModalBanner} src={src} alt="Banner" />
            )}
          </ProgressiveImage>
          <div className={styles.introModalContent}>
            <div>
              Kudi will reward you for new agents onboarded & are performing
              transactions in the first 60 days.
            </div>
            <h4 className={composeClasses(styles.bold, styles.blue)}>
              The first 30 days of onboarding
            </h4>
            <h4 className={styles.bold}>
              You earn N1,000 when the agent you referred completes 500
              transactions in the first 30 days.
            </h4>
            <div>The first 30 day earning is represented with</div>
            <div className={styles.introModalTarget}>
              {displayTarget(500, 500)}
            </div>
          </div>
          <div className={styles.introModalFooter}>
            <Button
              icon={CaretRight}
              clickHandler={() => setIntro(2)}
              buttonClass={styles.nextButton}
            />
          </div>
        </div>
      )}
      {intro === 2 && (
        <div className={styles.introModal}>
          <ProgressiveImage
            src={IntroBannerTwo}
            placeholder={IntroBannerTwoTiny}
          >
            {src => (
              <img className={styles.introModalBanner} src={src} alt="Banner" />
            )}
          </ProgressiveImage>
          <div className={styles.introModalContent}>
            <div>
              That’s not all, the more the transactions the more you get.
            </div>
            <h4 className={composeClasses(styles.bold, styles.green)}>
              The next 30 days
            </h4>
            <h4 className={styles.bold}>
              You will earn N1,000 on every 500 transactions completed by the
              new agent for the next 30 days.
            </h4>
            <div>Every commission earned is represented with</div>
            <div className={styles.introModalTarget}>
              {displayTarget(1000, 500)}
            </div>
          </div>
          <div className={styles.introModalFooter}>
            <Button
              icon={CaretLeft}
              clickHandler={() => setIntro(1)}
              buttonClass={styles.previousButton}
            />
            <Button
              icon={Check}
              clickHandler={closeFn}
              buttonClass={styles.continueButton}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

const Profile = ({ data: item }) => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.title}>Phone</div>
        <div className={styles.value}>{item.phone}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Bill Volume</div>
        <div className={styles.value}>
          {formatNumber(item.totalBillsVolume)}
        </div>
        <div className={styles.title}>Bill Value</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalBillsValue)}
        </div>
        <div className={styles.title}>Total Commission</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalBillsCommission)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transfer Volume</div>
        <div className={styles.value}>
          {formatNumber(item.totalTransfersVolume)}
        </div>
        <div className={styles.title}>Transfer Value</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalTransfersValue)}
        </div>
        <div className={styles.title}>Transfer Commission</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalTransfersCommission)}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Withdrawal Volume</div>
        <div className={styles.value}>
          {formatNumber(item.totalWithdrawalVolume)}
        </div>
        <div className={styles.title}>Withdrawal Value</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalWithdrawalsValue)}
        </div>
        <div className={styles.title}>Withdrawal Commission</div>
        <div className={styles.value}>
          ₦{generateAmount(item.totalWithdrawalCommission)}
        </div>
      </div>
      {/* <div className={styles.row}>
        <div className={styles.title}>Startimes Volume</div>
        <div className={styles.value}>₦{item.startimesVolume}</div>
        <div className={styles.title}>Startimes Value</div>
        <div className={styles.value}>₦{item.startimesValue}</div>
        <div className={styles.title}>Startimes Commission</div>
        <div className={styles.value}>₦{item.startimesCommission}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>GoTv Volume</div>
        <div className={styles.value}>₦{item.gotvVolune}</div>
        <div className={styles.title}>GoTv Value</div>
        <div className={styles.value}>₦{item.gotvValue}</div>
        <div className={styles.title}>GoTv Commission</div>
        <div className={styles.value}>₦{item.gotvCommission}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>DSTv Volume</div>
        <div className={styles.value}>₦{item.dstvVolume}</div>
        <div className={styles.title}>DSTv Value</div>
        <div className={styles.value}>₦{item.dstvValue}</div>
        <div className={styles.title}>DSTv Commission</div>
        <div className={styles.value}>₦{item.dstvCommission}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>PHCN Volume</div>
        <div className={styles.value}>₦{item.phcnVolume}</div>
        <div className={styles.title}>PHCN Value</div>
        <div className={styles.value}>₦{item.phcnValue}</div>
        <div className={styles.title}>PHCN Commission</div>
        <div className={styles.value}>₦{item.phcnCommission}</div>
      </div> */}
    </div>
  );
};

export const Action = ({ item }) => {
  const { setModalState } = useContext(ModalContext);

  const showProfile = item => {
    setModalState({
      visible: true,
      title: item.name,
      component: Profile,
      data: item,
      useFooter: true
    });
  };

  return isMobile ? (
    <button onClick={() => showProfile(item)} className={styles.actionButton}>
      <Eye />
      View Commissions
    </button>
  ) : (
    <button className={styles.action} onClick={() => showProfile(item)}>
      <Eye />
      <span>View</span>
    </button>
  );
};
