import React, { useContext, useState, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { useLoads } from 'react-loads';
import styles from './dashboardLayout.module.scss';
import Avatar from './avatar.png';
import NavItem from 'components/NavItem';
import {
  Logo,
  CaretRight,
  Dashboard,
  Referral,
  Commission,
  // Outlet,
  // Setting,
  // Resource,
  Hamburger,
  WalletBalance,
  Card,
  Vault,
  Asterisk,
  Close,
  SpearLeft,
  WalletTopup,
  FailedWallet,
  LogoutIcon
} from 'assets/svg';
import { Verve, Visa, Mastercard } from 'assets/png';
import { UserContext, ModalContext } from 'context';
import Input from 'components/Input';
import Tab from 'components/Tab';
import Button from 'components/Button';
import { serializeForm, generateAmount } from 'libs';
import { getWalletBalance } from '../../services/wallet';

const navItems = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: <Dashboard />
  },
  {
    title: 'Referrals',
    link: '/referrals',
    icon: <Referral />
  },
  {
    title: 'Commissions',
    link: '/commissions',
    icon: <Commission />
  }
  // {
  //   title: 'Manage Outlets',
  //   link: '/outlets',
  //   icon: <Outlet />
  // }
  // {
  //   title: 'Settings',
  //   link: '/settings',
  //   icon: <Setting />
  // },
  // {
  //   title: 'Resources',
  //   link: '/resources',
  //   icon: <Resource />
  // }
];

export const SideNav = ({ history, closeNavFn }) => {
  const { logout, data } = useContext(UserContext);
  const { setModalState } = useContext(ModalContext);

  const walletBalance = useCallback(() => getWalletBalance(), []);
  const { response, error, load, isRejected, isPending, isResolved } = useLoads(
    walletBalance,
    { defer: false }
  );

  const { amount: wallet } = (response && response.data) || { amount: 0 };

  const { agent } = data || {};

  const logoutHandler = () => {
    logout();
    history.push('/');
  };

  const openFundWalletModal = () => {
    return setModalState({
      visible: true,
      component: FundWallet,
      title: 'Fund Wallet',
      modalContentStyle: styles.fundWalletContent,
      headerStyle: styles.fundWalletHeader,
      data: wallet
    });
  };

  return (
    <div className={styles.sideNav}>
      <div className={styles.topSection}>
        <header className={styles.brandName}>
          <Logo />
        </header>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar}>
            <img src={Avatar} alt="" />
          </div>
          <div className={styles.agentDetails}>
            <div>{(agent && agent.businessName) || 'Business Name'}</div>
            <span>{(agent && agent.phoneNumber) || '08000000000'}</span>
          </div>
        </div>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar}>
            <WalletBalance />
          </div>
          <div className={styles.agentDetails}>
            <div>Wallet Balance</div>
            <span>&#8358;{generateAmount(wallet)}</span>
          </div>
        </div>

        {/* <button
          className={styles.fundWalletButton}
          onClick={openFundWalletModal}
        >
          Fund Wallet <CaretRight />
        </button> */}
      </div>
      <div className={styles.navSection}>
        <ul>
          {navItems.map((item, id) => (
            <NavItem to={item.link} key={id} onClick={closeNavFn}>
              {item.icon}
              {item.title}
            </NavItem>
          ))}
        </ul>
      </div>
      <button className={styles.logoutButton} onClick={() => logoutHandler()}>
        <LogoutIcon />
        Log Out
      </button>
    </div>
  );
};

const FundWallet = ({ data: wallet, closeFn }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [
    {
      id: 0,
      title: 'With Card',
      icon: <Card />,
      component: <FundWalletWithCard wallet={wallet} closeFn={closeFn} />
    },
    {
      id: 1,
      title: 'With Bank',
      icon: <Vault />,
      component: <FundWalletWithBankAccount wallet={wallet} closeFn={closeFn} />
    }
  ];

  const setTabToActive = id => {
    setActiveTab(id);
  };

  return (
    <div>
      <ul className={styles.fundWalletTab}>
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

      <div className={styles.fundWalletBalance}>
        Wallet Balance - &#8358;{generateAmount(wallet)}
      </div>
      <div className={styles.fundWalletBody}>
        {tabData[activeTab].component}
      </div>
    </div>
  );
};

const FundWalletWithCard = ({ wallet, closeFn }) => {
  const { setModalState } = useContext(ModalContext);
  const cardData = [
    {
      cardNumber: '***2671',
      type: 'verve'
    },
    {
      cardNumber: '***5539',
      type: 'visa'
    },
    {
      cardNumber: '***1234',
      type: 'master'
    }
  ];

  const formHandler = e => {
    e.preventDefault();
    e.persist();

    const formData = serializeForm(e.target);

    if (formData) {
      setModalState({
        visible: true,
        title: 'Kudi Pin',
        component: KudiPin,
        modalContentStyle: styles.fundWalletContent,
        headerStyle: styles.fundWalletHeader,
        data: wallet
      });
    }
  };

  return (
    <form action="" onSubmit={formHandler}>
      <Input
        type="text"
        name="cardNumber"
        className={styles.input}
        label="Enter Number"
        htmlFor="cardNumber"
        error={null}
        labelIcon={<Asterisk />}
      />
      <div className={styles.cardSelection}>
        <div className={styles.cardSelectionHeader}>
          <span>Choose A Card</span>
          <button className={styles.addCard}>
            <Card /> Add A New Card
          </button>
        </div>
        {cardData &&
          cardData.map((item, i) => (
            <div key={i} className={styles.radioBoxItem}>
              <div>
                <input type="radio" name="card" value={item.cardNumber} />
                <label className={styles.radioBoxLabel}>
                  {item.cardNumber}
                </label>
              </div>
              {renderCardImage(item.type)}
            </div>
          ))}
      </div>
      <div className={styles.fundWalletAction}>
        <Button
          text="Continue"
          type="submit"
          icon={CaretRight}
          buttonClass={styles.submitButton}
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

const renderCardImage = type => {
  let cardImage = null;

  switch (type) {
    case 'visa':
      cardImage = Visa;
      break;
    case 'verve':
      cardImage = Verve;
      break;
    case 'master':
      cardImage = Mastercard;
      break;
    default:
      break;
  }

  return (
    cardImage && <img src={cardImage} alt="" className={styles.cardImage} />
  );
};

const FundWalletWithBankAccount = () => {
  return <div>... In Progress</div>;
};

const KudiPin = ({ data, closeFn }) => {
  const { setModalState } = useContext(ModalContext);
  const formHandler = e => {
    e.preventDefault();
    e.persist();

    return setModalState({
      visible: true,
      component: SuccessfulTopUp
    });
  };

  const previousHandler = () => {
    return setModalState({
      visible: true,
      component: FundWallet,
      title: 'Fund Wallet',
      modalContentStyle: styles.fundWalletContent,
      headerStyle: styles.fundWalletHeader,
      data
    });
  };

  return (
    <div className={styles.kudiPin}>
      <div className={styles.previous}>
        <button type="button" onClick={previousHandler}>
          <SpearLeft />
          Change Amount / Card
        </button>
      </div>
      <div className={styles.kudiPinBody}>
        <form action="" onSubmit={formHandler}>
          <Input
            type="text"
            name="pin"
            className={styles.input}
            label="Enter Kudi Pin"
            htmlFor="pin"
            error={null}
            labelIcon={<Asterisk />}
          />
          <div className={styles.fundWalletAction}>
            <Button
              text="Continue"
              type="submit"
              icon={CaretRight}
              buttonClass={styles.submitButton}
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
      </div>
    </div>
  );
};

export const SuccessfulTopUp = ({ closeFn, data }) => {
  return (
    <div className={styles.topup}>
      <WalletTopup />
      <h3 className={styles.topupHeader}>Wallet Top-Up Successful</h3>
      <p>Your wallet has being credited with &#8358;{generateAmount(data)}</p>
      <Button
        text="Continue"
        type="submit"
        icon={CaretRight}
        buttonClass={styles.continueButton}
        clickHandler={() => {
          window.location.reload();
          closeFn();
        }}
      />
    </div>
  );
};

export const FailedTopUp = ({ closeFn, data }) => {
  return (
    <div className={styles.topup}>
      <FailedWallet />
      <h3 className={styles.topupHeader}>Wallet Top-Up Failed</h3>
      <p>Your wallet wasn’t credited fund your account & try again.</p>
      <Button
        text="Continue"
        type="submit"
        icon={CaretRight}
        buttonClass={styles.continueButton}
        clickHandler={() => {
          window.location.reload();
          closeFn();
        }}
      />
    </div>
  );
};

export const MobileNav = ({ title, toggleHandler }) => {
  return (
    <div className={styles.mobileNav}>
      <Hamburger onClick={toggleHandler} />
      <header>{title}</header>
    </div>
  );
};

export const MainContainer = ({ children, title, renderAction }) => {
  return (
    <div className={styles.mainContainerContent}>
      {!isMobile && (
        <header className={styles.pageHeader}>
          {title}
          {renderAction && renderAction()}
        </header>
      )}
      {children}
    </div>
  );
};
