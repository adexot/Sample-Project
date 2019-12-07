import React, { Fragment } from 'react';
// import styles from './shimmer.module.scss';
import { Default, Table, Card } from './shimmer.component';

const Shimmer = ({ variant }) => {
  let shell = variant || 'default';
  switch (variant) {
    case 'referrals':
      shell = (
        <Table
          headColumnWidth={['50%', '50%', '100%', '40%', '60%']}
          tableColumnWidth={['15%', '30%', '20%', '20%', '15%']}
        />
      );
      break;
    case 'card':
      shell = <Card />;
      break;
    default:
      shell = <Default />;
  }

  return <Fragment>{shell}</Fragment>;
};

export default Shimmer;
