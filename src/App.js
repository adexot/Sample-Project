import React, { Component } from 'react';
import * as moment from 'moment';
import { UserContext } from './context';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

// import component here
import DashboardLayout from 'components/DashboardLayout';

// import containers here
import Login from './containers/Login';
import Referral, { Invite } from 'containers/Referral';
import ManageOutlet, { ManageOutletHeader } from 'containers/ManageOutlet';
import Dashboard, { DashboardTab, cashOutHistory } from 'containers/Dashboard';
import Commission, {
  AgentCommission,
  CommisionHeader
} from 'containers/Commission';

import constants from './constants';
import { localStore } from 'libs';

const ProtectedRoute = ({
  component: RouteComponent,
  title,
  renderHeader,
  ...rest
}) => {
  const storedUserData = localStore.get(constants.userStoreName, true);

  return (
    <Route
      {...rest}
      render={props =>
        storedUserData ? (
          <DashboardLayout title={title} renderAction={renderHeader}>
            <RouteComponent {...props} />
          </DashboardLayout>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  /**
   * TODO: Add the following methods to this file
   * 1. componentDidCatch to handle Error in rendering
   */

  constructor(props) {
    super(props);
    const storedUserData = localStore.get(constants.userStoreName, true);
    this.state = {
      user: {
        data: storedUserData || null,
        isLoggedIn: storedUserData ? true : false
      }
    };
  }

  componentWillMount() {
    this.checkTokenExpiry();
  }

  checkTokenExpiry = () => {
    const userData = localStore.get(constants.userStoreName, true);

    if (userData && moment().isAfter(userData.expires))
      return this.logoutUser();
    return null;
  };

  logoutUser() {
    this.setState(
      {
        user: {
          data: {},
          isLoggedIn: false
        }
      },
      () => {
        localStore.remove(constants.userStoreName);
      }
    );
  }

  updateUser(user) {
    this.setState(
      {
        user: {
          data: user,
          isLoggedIn: true
        }
      },
      () => {
        if (this.state.user) {
          localStore.set(constants.userStoreName, this.state.user.data, true);
        }
      }
    );
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state.user,
          logout: () => this.logoutUser(),
          updateUser: user => this.updateUser(user)
        }}
      >
        <Router>
          <Switch>
            <Route path='/' exact component={Login} />
            <ProtectedRoute
              path='/referrals'
              title='referrals'
              exact
              component={Referral}
            />
            <ProtectedRoute
              path='/referral/invite'
              title='referrals'
              exact
              component={Invite}
            />
            <ProtectedRoute
              path='/dashboard'
              title='dashboard'
              // renderHeader={DashboardTab}
              exact
              component={Dashboard}
            />
            <ProtectedRoute
              path='/commission-wallet-history'
              title='Commission Wallet History'
              exact
              component={cashOutHistory}
            />
             {/* FIXME: agent transactions commission  as default in the mean time till onboarding api is ready*/}
            <ProtectedRoute
              path='/commissions'
              title='commissions'
              renderHeader={CommisionHeader}
              exact
              component={AgentCommission}
            />
           
            {/* <ProtectedRoute
              path="/commissions/transactions"
              title="commissions"
              renderHeader={CommisionHeader}
              exact
              component={AgentCommission}
            /> */}
            <ProtectedRoute
              path='/outlets'
              title='Manage Outlets'
              // renderHeader={ManageOutletHeader}
              exact
              component={ManageOutlet}
            />
          </Switch>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default App;
