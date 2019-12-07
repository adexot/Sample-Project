import React, { Fragment } from 'react';
import styles from './shimmer.module.scss';
import { composeClasses } from 'libs';

export const Default = () => {
  return (
    <div>
      <Line />
      <Line />
      <Line />
      <Line />
    </div>
  );
};

const Line = () => <div className={styles.line} />;

export const Table = ({ tableColumnWidth, headColumnWidth }) => {
  const renderHeader = () => {
    return (
      <tr>
        {headColumnWidth.map((item, index) => (
          <th key={index} width={tableColumnWidth[index]}>
            <div
              className={composeClasses(styles.line, styles.lightColor)}
              style={{ width: item }}
            />
          </th>
        ))}
      </tr>
    );
  };
  const renderBody = () => {
    return (
      <Fragment>
        {new Array(9).fill('_').map((item, i) => (
          <tr key={i}>
            {tableColumnWidth.map((_, index) => (
              <td key={index}>
                <Line />
              </td>
            ))}
          </tr>
        ))}
      </Fragment>
    );
  };
  return (
    <table className={styles.table}>
      <thead>{renderHeader()}</thead>
      <tbody>{renderBody()}</tbody>
    </table>
  );
};

export const Card = () => {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          <Line />
        </div>
        <div className={styles.value}>
          <Line />
        </div>
      </div>
    </div>
  );
};
