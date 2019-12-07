import React from 'react';
import styles from './table.module.scss';
import { composeClasses, isNotEmptyArray } from '../../libs';

const renderHead = head => {
  return (
    <thead>
      <tr>
        {isNotEmptyArray(head) &&
          head.map((item, key) => <th key={key}>{item}</th>)}
      </tr>
    </thead>
  );
};

const renderBody = renderRow => {
  return <tbody>{typeof renderRow === 'function' && renderRow()}</tbody>;
};

const Table = ({ head, renderRow, tableStyle }) => {
  return (
    <table className={composeClasses(styles.table, tableStyle)}>
      {renderHead(head)}
      {renderBody(renderRow)}
    </table>
  );
};

export default Table;
