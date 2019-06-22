import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import _ from 'lodash';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { AddressMarkerIcon, LogoutIcon } from 'mdi-react';
import { Row, Col, Button } from 'reactstrap';
import StringWorkerSingleton from '../../../services/string';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

class TopbarProfile extends PureComponent {
	constructor() {
		super();
		this.state = {
		collapse: false,
		};
	}

    logout = async () => {
        await this.props.profile.logout();
    }

	render() {
        let profile = this.props.profile;
        if(_.isEmpty(profile)){ return null; }
        let addressConcat = StringWorkerSingleton.toAddressConcat(profile.getAddress());
        
		return (
			<div className={'not-mobile'}>
                <Row>
                    <Col lg={4}></Col>
                    <Col lg={3}>
                        <AddressMarkerIcon className={'top-icon'}/>
                        <p >{addressConcat}</p>
                    </Col>
                    <Col lg={2}>
                        <div className="topbar__avatar" onClick={this.toggle}>
                            <img className="topbar__avatar-img" src={profile.getImage()} alt="avatar" />
                            <p className="topbar__avatar-name">{profile.getType()}</p>
                        </div>
                        {this.state.collapse && <button className="topbar__back" onClick={this.toggle} />}
                    </Col>
                    <Col lg={3}>
                        <div style={{marginLeft : 40, marginBottom : 10}}  className="topbar__avatar" onClick={this.logout}>
                            <LogoutIcon className={'top-icon'}/>
                        </div>
                    </Col>
                </Row>
			</div>
		);
	}
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}



export default connect(mapStateToProps)(TopbarProfile);
