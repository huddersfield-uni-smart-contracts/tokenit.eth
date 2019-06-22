import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarMail from './TopbarMail';
import TopbarNotification from './TopbarNotification';
import TopbarSearch from './TopbarSearch';
import TopbarLanguage from './TopbarLanguage';
import {Col, Row} from 'reactstrap';

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

    return (
        <div className="topbar">
            <Row>
                <Col lg={6}>
                    <TopbarSidebarButton
                        changeMobileSidebarVisibility={changeMobileSidebarVisibility}
                        changeSidebarVisibility={changeSidebarVisibility}
                    />
                </Col>
                <Col lg={6}>
                    <TopbarProfile />
                </Col>
            </Row>
        </div>
    );
  }
}

export default Topbar;
