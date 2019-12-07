import React from 'react';
import { isMobile } from 'react-device-detect';
import styles from './dashboard.module.scss';
import {
  CommisionColumn,
  PageLayout,
  MobileChart
} from './dashboard.component';
import ButtonList from 'components/ButtonList';
import { composeClasses, generateMonthYear } from 'libs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const chartData = [
  {
    name: 'Mon',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Tue',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Wed',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Thu',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Fri',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Sat',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Sun',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

const Dashboard = () => {
  return (
    <PageLayout>
      <div className={styles.introText}>
        The transactions below are for this month -
        <span className={styles.redText}>{generateMonthYear()}</span>
      </div>
      <div className={styles.dashboardFlex}>
        <div className={styles.leftColumn}>
          <CommisionColumn />
        </div>

        {isMobile && <MobileChart />}

        {!isMobile && (
          <div className={styles.dashboardChart}>
            <div className={styles.listColumn}>
              <div className={styles.listColumnHeader}>
                <div
                  className={composeClasses(
                    styles.listTitle,
                    styles.textMedium
                  )}
                >
                  Commissions Earned on Outlet Transactions
                </div>
                <div className={styles.listAction}>
                  <div className={styles.dateRange} />
                  <div className={styles.ll}>
                    <ButtonList>
                      <li data-active>Week 1</li>
                      <li>Week 2</li>
                      <li>Week 3</li>
                      <li>Week 4</li>
                    </ButtonList>
                  </div>
                </div>
              </div>
              <div className={styles.listColumnContent}>
                <p className={styles.helpText}>
                  Click on a bar below to view transaction count
                </p>
                <div className={styles.desktopChart}>
                  {/* Chart ref: https://code.sololearn.com/W0ixcL7827X5 */}
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid strokeDasharray="0 0" stroke="#F0F4F9" />
                      <XAxis dataKey="name" />
                      <YAxis
                        allowDataOverflow={true}
                        domain={[0, 'dataMax + 1000']}
                      />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Bar dataKey="pv" fill="#E29138" />
                      <Bar dataKey="uv" fill="#743E8C" />
                      <Bar dataKey="amt" fill="#0091B1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={styles.listColumnFooter}>
                <div>This color represents the data in graph</div>
                <ul className={styles.keyList}>
                  <li className={styles.keyItem}>
                    <span className={styles.transferIndicator} />
                    Transfers
                  </li>
                  <li className={styles.keyItem}>
                    <span className={styles.withdrawalIndicator} />
                    Withdrawals
                  </li>
                  <li className={styles.keyItem}>
                    <span className={styles.billIndicator} />
                    Bill Payments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* </div> */}
    </PageLayout>
  );
};

export default Dashboard;
