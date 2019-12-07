import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navItem.module.scss';

const NavItem = ({ to, children, activeClassName, className, ...props }) => (
  <li>
    <NavLink
      activeClassName={activeClassName || styles.navItemActive}
      className={className || styles.navItem}
      to={to}
      {...props}
    >
      {children}
    </NavLink>
  </li>
);

export default NavItem;
