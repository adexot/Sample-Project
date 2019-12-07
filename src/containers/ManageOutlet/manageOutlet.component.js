import React, { Fragment, useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import NavItem from 'components/NavItem';
import styles from './manageOutlet.module.scss';
import {
  Bell,
  Eye,
  CaretRight,
  Asterisk,
  Calendar,
  AddAgent,
  FundWallet,
  Setting,
  Close,
  Wallet,
  WalletTopup
} from 'assets/svg';
import Input from 'components/Input';
import { ModalContext, UserContext } from 'context';
import SortModal from 'components/SortModal';
import CalendarModal from 'components/CalendarModal';
import LinKOutletImage from './link-outlet.png';
import { composeClasses, isNotEmptyArray } from 'libs';
import Button from 'components/Button';
import Tab from 'components/Tab';
import { agentList } from './mock'; //TODO: remove mock for actual data

const tabData = [
  {
    to: '/outlets',
    title: 'All Agents'
  },
  {
    to: '/suspended',
    title: 'Suspended Agents'
  }
];

const apiData = [
  {
    id: 1,
    date: '02 Mar 19',
    fullName: 'Firstname Lastname',
    phone: '07023456789',
    transaction: '49',
    amount: 'N125,000'
  },
  {
    id: 1,
    date: '02 Mar 19',
    fullName: 'Firstname Lastname',
    phone: '07023456789',
    transaction: '49',
    amount: 'N125,000'
  },
  {
    id: 1,
    date: '02 Mar 19',
    fullName: 'Firstname Lastname',
    phone: '07023456789',
    transaction: '49',
    amount: 'N125,000'
  },
  {
    id: 1,
    date: '02 Mar 19',
    fullName: 'Firstname Lastname',
    phone: '07023456789',
    transaction: '49',
    amount: 'N125,000'
  }
];

export const MobileTab = () => {
  return <ListAction />;
};

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

const LinkOutlet = () => {
  const { setModalState } = useContext(ModalContext);

  const openLinkOutlet = () => {
    setModalState({
      visible: true,
      title: 'Link an Outlet',
      component: LinkOutletComponent
    });
  };

  return (
    <Button
      text="Link Outlet"
      icon={AddAgent}
      buttonClass={styles.linkOutletButton}
      clickHandler={() => openLinkOutlet()}
    />
  );
};

export const LinkOutletButton = LinkOutlet;

const ListAction = () => {
  const { setModalState } = useContext(ModalContext);

  const openModal = () => {
    setModalState({
      visible: true,
      component: () => {
        const sortActions = [
          {
            title: 'All Agents',
            value: 'all'
          },
          {
            title: 'Suspended Agents',
            id: 'active'
          }
        ];
        return <SortModal actionList={sortActions} />;
      },
      type: 'filter'
    });
  };
  return (
    <div className={styles.listAction}>
      <LinkOutlet />
      <button className={styles.agentFilterButton} onClick={() => openModal()}>
        <span>All Invite</span>
        <CaretRight />
      </button>
    </div>
  );
};

export const AgentSearch = () => {
  return (
    <input
      type="text"
      className={styles.agentSearchInput}
      placeholder="Search Agent"
    />
  );
};

const getInitials = name => {
  const nameArray = name.split(' ');
  let initials = '';
  for (let i = 0; i < 2; i++) {
    initials += nameArray[i].charAt(0);
  }
  return initials;
};

const AgentListModal = () => {
  return (
    <Fragment>
      <AgentActions />
      <div className={styles.agentListContainer}>
        {apiData && apiData.map((agent, index) => <AgentCard item={agent} />)}
      </div>
    </Fragment>
  );
};

export const AgentList = ({ setAgentFn }) => {
  const [active, setActive] = useState(2);
  const { setModalState } = useContext(ModalContext);

  const setActiveAgent = (id, name) => {
    setActive(id);
    setAgentFn(name);
    if (isMobile) {
      setModalState({
        visible: true,
        title: name,
        component: AgentListModal,
        headerStyle: styles.modalHeader
      });
    }
  };

  return (
    <ul>
      {agentList.map(agent => {
        const name = `${agent.firstname} ${agent.lastname}`;
        return (
          <li
            className={styles.agentInfo}
            style={
              active === agent.id
                ? {
                    borderLeft: `2px solid ${agent.activeColor || '#18379A'}`,
                    backgroundColor: '#F0F6FF'
                  }
                : {}
            }
            onClick={() => {
              setActiveAgent(agent.id, name);
            }}
          >
            <div className={styles.agentAvatar}>
              <div
                className={styles.agentInitials}
                style={{ backgroundColor: agent.color }}
              >
                {getInitials(name)}
              </div>
            </div>
            <div className={styles.agentDetails}>
              <div>{name}</div>
              <span className={styles.agentPhone}>{agent.phone}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

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
    <Fragment>
      <div className={styles.cardDate}>{item.date}</div>
      <div className={styles.agentCard}>
        <div className={styles.row}>
          <div className={styles.title}>Full Name</div>
          <div className={styles.value}>{item.fullName}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>Phone Number</div>
          <div className={styles.value}>{item.phone}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>Total Transaction vol</div>
          <div className={styles.value}>{item.transaction}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.title}>Amount</div>
          <div className={styles.value}>{item.amount}</div>
        </div>
      </div>
    </Fragment>
  );
};

export const InviteForm = () => {
  return (
    <form action="/referral/invite" method="" onSubmit={() => {}}>
      <Input
        type="tel"
        name="phone"
        className={styles.input}
        label="Phone Number"
        htmlFor="phone"
        error={null}
        labelIcon={<Asterisk />}
      />
      <Input
        type="text"
        name="firstname"
        className={styles.input}
        label="First Name"
        htmlFor="firstname"
        error={null}
        labelIcon={<Asterisk />}
      />
      <Input
        type="text"
        name="lastname"
        className={styles.input}
        label="Last Name"
        htmlFor="lastname"
        error={null}
        labelIcon={<Asterisk />}
      />
      <div className={styles.inviteAction}>
        <button type="submit" className={styles.inviteButton}>
          Send Invite
          <CaretRight />
        </button>
      </div>
    </form>
  );
};

const LinkOutletComponent = ({ closeFn }) => {
  return (
    <div className={styles.linkOutletContainer}>
      <img className={styles.linkOutletImage} src={LinKOutletImage} alt="" />
      <p className={styles.linkOutletIntro}>
        Link an outlet to your account so you can manage it remotely. Enter the
        phone number & the KUDI transaction PIN of the outlet.
      </p>
      <form action="">
        <Input
          type="tel"
          name="phone"
          className={styles.input}
          label="Enter Phone Number"
          htmlFor="phone"
          error={null}
          labelIcon={<Asterisk />}
        />
        <Input
          type="tel"
          name="pin"
          className={styles.input}
          label="Outlet Transaction PIN"
          htmlFor="pin"
          error={null}
          labelIcon={<Asterisk />}
        />
        <div className={styles.linkOutletAction}>
          <Button
            text="Add Outlet"
            icon={CaretRight}
            buttonClass={styles.submitButton}
          />
          {!isMobile && (
            <button className={styles.cancelButton} onClick={closeFn}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const AgentActions = () => {
  return (
    <div className={styles.ll}>
      <button
        className={composeClasses(
          styles.listActionButton,
          styles.fundWalletButton
        )}
      >
        <FundWallet />
        Fund Wallet
      </button>
      <button
        className={composeClasses(
          styles.listActionButton,
          styles.agentProfileButton
        )}
      >
        <Setting />
        Agent Profile
      </button>
    </div>
  );
};

export const AgentActionsComponent = AgentActions;

export const FundWalletComponent = ({ closeFn }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabData = [
    {
      id: 0,
      title: 'From My Kudi Wallet',
      icon: <Wallet />,
      component: <FundWalletWithKudi closeFn={closeFn} />
    }
  ];

  const setTabToActive = id => {
    setActiveTab(id);
  };

  return (
    <>
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
        Wallet Balance - &#8358;980.00
      </div>
      <div className={styles.fundWalletBody}>
        {tabData[activeTab].component}
      </div>
    </>
  );
};

const FundWalletWithKudi = ({ closeFn }) => {
  const { setModalState } = useContext(ModalContext);
  const formHandler = e => {
    e.preventDefault();
    e.persist();

    return setModalState({
      visible: true,
      component: SuccessfulTopUp
    });
  };
  return (
    <div className={styles.linkOutletContainer}>
      <form action="" onSubmit={formHandler}>
        <Input
          type="number"
          name="amount"
          className={styles.input}
          label="Enter Amount"
          htmlFor="amount"
          error={null}
          labelIcon={<Asterisk />}
        />
        <Input
          type="number"
          name="pin"
          className={styles.input}
          label="Enter Kudi PIN"
          htmlFor="pin"
          error={null}
          labelIcon={<Asterisk />}
        />
        <div className={styles.linkOutletAction}>
          <Button
            text="Continue"
            icon={CaretRight}
            buttonClass={styles.submitButton}
            type="submit"
          />
          {!isMobile && (
            <button className={styles.cancelButton} onClick={closeFn}>
              <Close />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export const AgentProfileComponent = ({ closeFn }) => {
  const {
    data: { agent }
  } = useContext(UserContext);

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.title}>Full Name</div>
        <div className={styles.value}>{agent.businessName || ''}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Wallet Number</div>
        <div className={styles.value}>{agent.phoneNumber}</div>
        <div className={styles.title}>Email Address</div>
        <div className={styles.value}>{agent.email}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Outlet Address</div>
        <div className={styles.value}>{agent.city}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Sign Up Date</div>
        <div className={styles.value}>{agent.startDate || ''}</div>
        <div className={styles.title}>Terminal ID</div>
        <div className={styles.value}>{agent.terminalID || ''}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Status</div>
        <div className={styles.value}>{agent.active || ''}</div>
      </div>
      <div className={styles.linkOutletAction}>
        <button className={styles.cancelButton} onClick={closeFn}>
          <Close />
          Cancel
        </button>
      </div>
    </div>
  );
};

const SuccessfulTopUp = ({ closeFn }) => {
  return (
    <div className={styles.topup}>
      <WalletTopup />
      <h3 className={styles.topupHeader}>Agent Wallet Top-Up Successful</h3>
      <p className={styles.topupContent}>
        You have credited Firstname Lastname (08023456789) wallet with N1,000.00
      </p>
      <Button
        text="Continue"
        type="submit"
        icon={CaretRight}
        buttonClass={styles.continueButton}
        clickHandler={closeFn}
      />
    </div>
  );
};
