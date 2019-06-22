import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

class TopbarSidebarButton extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility } = this.props;

    return (
      <div>
        <Link to={'/'} disabled={true} className="topbar__button topbar__button--mobile" onClick={changeMobileSidebarVisibility}>
          <img src={logo} alt="" className="topbar__button-icon" />
        </Link>
      </div>
    );
  }
}

export default TopbarSidebarButton;
