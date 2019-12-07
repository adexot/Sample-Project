import React, { Fragment, useContext, useState } from 'react';
import NavItem from 'components/NavItem';
import styles from './referral.module.scss';
import {
  Bell,
  Eye,
  CaretRight,
  Asterisk,
  Spin,
  ReferralSent,
  Close
} from 'assets/svg';
import Input from 'components/Input';
import { ModalContext } from 'context';
import SortModal from 'components/SortModal';
import { serializeForm, generateDate, isNotEmptyArray } from 'libs';
import { addReferral } from 'services/referral';
import DateButton from 'components/DateButton';

const tabData = [
  {
    to: '/referrals',
    title: 'All Invites'
  },
  {
    to: '/referral/invite',
    title: 'Invite New Agent'
  }
];

export const MobileTab = () => {
  return (
    <ul className={styles.mobileTab}>
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
            title: 'All Agents',
            value: 'all'
          },
          {
            title: 'Active',
            value: 'active'
          },
          {
            title: 'Registered',
            value: 'registered'
          },
          {
            title: 'Pending',
            value: 'pending'
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
      title: 'Select Invite Status',
      type: 'filter'
    });
  };
  return (
    <div className={styles.listAction}>
      <DateButton callbackFn={callbackFn} label={label} />
      <button className={styles.inviteFilterButton} onClick={() => openModal()}>
        <span>{currentValue === 'all' ? 'All Agents' : currentValue}</span>
        <CaretRight />
      </button>
    </div>
  );
};

export const renderStatus = status => {
  return (
    <Fragment>
      <span className={styles[status.toLowerCase()]} />
      <span>{status}</span>
    </Fragment>
  );
};

const Profile = ({ item, closeFn }) => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.title}>Phone</div>
        <div className={styles.value}>08188</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transfer Volume</div>
        <div className={styles.value}>3874</div>
        <div className={styles.title}>Transfer Commission</div>
        <div className={styles.value}>N10,000</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Transfer Volume</div>
        <div className={styles.value}>3874</div>
        <div className={styles.title}>Transfer Commission</div>
        <div className={styles.value}>N10,000</div>
        <div className={styles.title}>Transfer Commission</div>
        <div className={styles.value}>N10,000</div>
      </div>
      <div className={styles.modalAction}>
        <button className={styles.cancelButton} onClick={closeFn}>
          <Close />
          Close
        </button>
      </div>
    </div>
  );
};

export const Action = ({ item }) => {
  const { setModalState } = useContext(ModalContext);

  const showProfile = item => {
    setModalState({
      visible: true,
      title: item.referralName,
      component: Profile
    });
  };

  let action = item.action ? 'Buzz' : 'View';

  return (
    <button
      className={styles.action}
      onClick={() => (action === 'View' ? showProfile(item) : null)}
    >
      {action === 'View' ? <Eye /> : <Bell />}
      <span>{action}</span>
    </button>
  );
};

export const AgentCard = ({ item }) => {
  return (
    <div className={styles.agentCard}>
      <div className={styles.row}>
        <div className={styles.title}>Date</div>
        <div className={styles.value}>{generateDate(item.referralDate)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Full Name</div>
        <div className={styles.value}>{item.referredAgentName}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Wallet Number</div>
        <div className={styles.value}>{item.referredPhone}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Total Transaction vol</div>
        <div className={styles.value}>{item.transaction}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Status</div>
        <div className={styles.value}>{item.referralStatus}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>Amount</div>
        <div className={styles.value}>{item.amount}</div>
      </div>
    </div>
  );
};

export const InviteForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [phoneNumber, setPhoneNumber] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    e.persist();
    setLoading(true);
    setError({});

    const formData = serializeForm(e.target);
    const errorObject = {};

    const userDetails = {
      phoneNumber: formData.phone,
      firstName: formData.firstname,
      lastName: formData.lastname
    };

    if (isNaN(userDetails.phoneNumber))
      errorObject.phone = 'You have to enter a phone number';
    if (userDetails.phoneNumber.length !== 11) {
      let errorMessage = '';
      if (userDetails.phoneNumber.length < 11)
        errorMessage = 'You’ve entered less than 11 digits';
      if (userDetails.phoneNumber.length > 11)
        errorMessage = 'You’ve entered more than 11 digits';
      errorObject.phone = errorMessage;
    }

    if (Object.keys(errorObject).length === 0) {
      await addReferral(userDetails)
        .then(res => {
          setPhoneNumber(formData.phone);
        })
        .catch(({ response: { data: { message } } }) => {
          setError({
            response:
              message ||
              'An error occured, please confirm the form details and try again.'
          });
        });
    } else {
      setError(errorObject);
    }

    setLoading(false);
    return;
  };
  if (phoneNumber)
    return (
      <ReferralSuccess
        handleContinue={() => {
          setPhoneNumber(null);
        }}
        phoneNumber={phoneNumber}
      />
    );
  return (
    <Fragment>
      {!!error.response || (
        <p className={styles.helpText}>
          <Asterisk />
          means that the field is required
        </p>
      )}
      {error.response && (
        <div className={styles.responseError}>{error.response}</div>
      )}
      <form method="post" onSubmit={handleSubmit}>
        <Input
          type="tel"
          name="phone"
          className={styles.input}
          label="Phone Number"
          htmlFor="phone"
          error={(error && error.phone) || null}
          labelIcon={<Asterisk />}
        />
        <Input
          type="text"
          name="firstname"
          className={styles.input}
          label="First Name"
          htmlFor="firstname"
          error={null}
        />
        <Input
          type="text"
          name="lastname"
          className={styles.input}
          label="Last Name"
          htmlFor="lastname"
          error={null}
        />
        <div className={styles.inviteAction}>
          <button type="submit" className={styles.inviteButton}>
            Send Invite
            {loading ? <Spin /> : <CaretRight />}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export const ReferralSuccess = ({ handleContinue, phoneNumber }) => {
  return (
    <div className={styles.referralSuccess}>
      <ReferralSent />
      <h3 className={styles.title}>Invitation Sent</h3>
      <p className={styles.message}>
        {phoneNumber} has been sent an invitation link
      </p>
      <button
        className={styles.continueButton}
        onClick={() => {
          handleContinue();
          window.location.reload();
        }}
      >
        Continue
        <CaretRight />
      </button>
    </div>
  );
};
