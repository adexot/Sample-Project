import React, { useState, useContext } from 'react';
import { isMobile } from 'react-device-detect';
import styles from './manageOutlet.module.scss';
import Table from 'components/Table';
import {
  MobileTab,
  renderAction,
  AgentList,
  AgentSearch,
  LinkOutletButton,
  FundWalletComponent,
  AgentProfileComponent
} from './manageOutlet.component';
import DateButton from 'components/DateButton';
import { Setting, FundWallet } from 'assets/svg';
import { composeClasses } from 'libs';
import { UserContext, ModalContext } from 'context';

const PageLayout = ({ children }) => {
  return (
    <div className={styles.outlet}>
      {isMobile && <MobileTab />}
      {children}
    </div>
  );
};

const agentData = [
  {
    id: 1,
    date: '02 Mar 19',
    transfer: 2000,
    withdrawal: 158,
    bill: 51,
    transactions: 1000,
    action: 0
  },
  {
    id: 1,
    date: '02 Mar 19',
    transfer: 2000,
    withdrawal: 158,
    bill: 51,
    transactions: 1000,
    action: 0
  },
  {
    id: 1,
    date: '02 Mar 19',
    transfer: 2000,
    withdrawal: 158,
    bill: 51,
    transactions: 1000,
    action: 0
  }
];

const ManageOutlet = () => {
  const [agent, setAgent] = useState('Kolawole Ajisafe');
  const {
    data: { wallet }
  } = useContext(UserContext);
  const { setModalState } = useContext(ModalContext);

  //   TODO: rework this when data is available
  const setActiveAgent = agent => setAgent(agent);

  const openModal = (component, title = '', modalContentStyle, headerStyle) => {
    setModalState({
      visible: true,
      title: title,
      component: component,
      modalContentStyle: modalContentStyle,
      headerStyle: headerStyle
    });
  };

  return (
    <PageLayout>
      {isMobile ? (
        <div>
          <div className={styles.agentColumnHeader}>
            <AgentSearch />
          </div>
          <AgentList setAgentFn={setActiveAgent} />
        </div>
      ) : (
        <div className={styles.outletFlex}>
          <div className={styles.agentColumn}>
            <div className={styles.agentColumnHeader}>
              <AgentSearch />
            </div>
            <div className={styles.agentColumnContent}>
              <LinkOutletButton />
              <AgentList setAgentFn={setActiveAgent} />
            </div>
          </div>
          <div className={styles.listColumn}>
            <div className={styles.listColumnHeader}>
              <div className={styles.listTitle}>{agent}</div>
              <div className={styles.listAction}>
                <div className={styles.dateRange}>
                  <DateButton />
                </div>
                <div className={styles.ll}>
                  <button
                    className={composeClasses(
                      styles.listActionButton,
                      styles.fundWalletButton
                    )}
                    onClick={() =>
                      openModal(
                        FundWalletComponent,
                        'Fund Agent Wallet',
                        styles.fundWalletContent,
                        styles.fundWalletHeader
                      )
                    }
                  >
                    <FundWallet />
                    Fund Wallet
                  </button>
                  <button
                    className={composeClasses(
                      styles.listActionButton,
                      styles.agentProfileButton
                    )}
                    onClick={() =>
                      openModal(AgentProfileComponent, 'Agent Profile')
                    }
                  >
                    <Setting />
                    Agent Profile
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.listColumnContent}>
              <div className={styles.walletBalanceContainer}>
                Wallet Balance - N{wallet.formattedBalance}
              </div>
              <Table
                head={[
                  'Date/Time',
                  'Transfer Volume (N)',
                  'Withdrawal Volume (N)',
                  'Bill Payment Volume (N)',
                  'Transactions Total Value (N)',
                  'Action'
                ]}
                tableStyle={styles.listTable}
                renderRow={() =>
                  agentData.map(item => (
                    <tr key={item.id}>
                      <td>{item.date}</td>
                      <td>{item.transfer}</td>
                      <td>{item.withdrawal}</td>
                      <td>{item.bill}</td>
                      <td>{item.transactions}</td>
                      <td className={styles.action}>
                        {renderAction(item.action)}
                      </td>
                    </tr>
                  ))
                }
              />
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ManageOutlet;
