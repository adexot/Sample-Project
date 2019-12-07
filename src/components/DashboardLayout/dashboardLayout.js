import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { LoadsContext } from 'react-loads';
import { ModalContext } from 'context';
import { SideNav, MainContainer, MobileNav } from './dashboardLayout.component';
import styles from './dashboardLayout.module.scss';
import { composeClasses } from 'libs';
import { CloseNav } from 'assets/svg';
import Modal from 'components/Modal';

const DashboardLayout = ({ history, children, title, renderAction }) => {
  const [openNav, setOpenNav] = useState(false);
  const [modal, setModal] = useState({
    component: null,
    title: '',
    visible: false,
    fullModal: false,
    modalContentStyle: null,
    headerStyle: '',
    position: null,
    data: null
  });

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <ModalContext.Provider
      value={{
        ...modal,
        setModalState: params => setModal(params)
      }}
    >
      <div className={styles.dashboardContainer}>
        <div
          className={composeClasses(
            styles.sideNavContainer,
            openNav && styles.open
          )}
        >
          <SideNav
            history={history}
            closeNavFn={() => openNav && toggleNav()}
          />
          <div onClick={toggleNav} className={styles.navBackDrop}>
            <CloseNav />
          </div>
        </div>
        <div className={styles.mainContainer}>
          {isMobile && (
            <MobileNav title={title} toggleHandler={() => toggleNav()} />
          )}
          <LoadsContext.Provider>
            <MainContainer title={title} renderAction={renderAction}>
              {children}
            </MainContainer>
          </LoadsContext.Provider>
        </div>

        {modal.visible && (
          <Modal
            component={modal.component}
            title={modal.title}
            closeModal={modal.closeModal}
            fullModal={modal.fullModal}
            modalContentStyle={modal.modalContentStyle}
            headerStyle={modal.headerStyle}
            position={modal.position}
            data={modal.data}
            useFooter={modal.useFooter}
            type={modal.type}
            disableBackdropClick={modal.disableBackdropClick}
          />
        )}
      </div>
    </ModalContext.Provider>
  );
};

export default withRouter(DashboardLayout);
