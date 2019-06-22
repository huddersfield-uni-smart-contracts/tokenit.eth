import React from 'react';
import { Card, CardBody, Col, Row, Container } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import ProfileCard from './containers/ProfileCard';
import { getValidator, getClient, getcompany } from '../../const/profiles';
import Account from '../../controllers/Account';
const company = `${process.env.PUBLIC_URL}/img/company.png`;
const client = `${process.env.PUBLIC_URL}/img/client.png`;
const validator = `${process.env.PUBLIC_URL}/img/validator.png`;
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

/* User Map - Mocks */
const userMap = {
    'validator'     : getValidator(),
    'client'        : getClient(),
    'company'       : getcompany()
}

class ProfilePickerPage extends React.Component{

    constructor(props){
        super(props)
    }

    enter = async (userType) => {
        /* Choose user Type */
        var Acc = new Account(userMap[userType]);
        try{
            await Acc.update();
            this.props.history.push(`/${new String(userType).toLowerCase()}`)
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    render = () => {
        return (
            <Container>
                <Row>
                    <img className="company-logo-card" src={logo} alt="avatar" />
                </Row>
                <Row>
                    <p className='text-initial_page'>
                        Welcome to the autonomous PBA smart-auction! Here you’ll be able to create payments that respect certain conditions, in order to make payments between auctionor – auctioned faster, simpler and more transparent.
                    <p>  
                        To start using the autonomous PBA, please make sure all agents have a valid Ethereum address. </p>
                    <p>
                        Start by defining addresses for Validators and Companies, by clicking on each icon respectively.
                        Afterwards, you can click on the Client agent to define the initial conditions for the payments smart-
                        auction.
                    </p>
                    <p>
                        Remember: amendments can be made to some variables such as date, time or names, but not to
                        amounts.
                    </p>
                    </p>
                </Row>
                <Row style={{marginTop : 50}} >
                    <Col lg={4}>
                        <ProfileCard enter={this.enter} type={'client'} image={client} name={'Client'} text={'The agent responsible for defining the auction rules and for making the payments'} />
                    </Col>
                    <Col lg={4}>
                        <ProfileCard enter={this.enter} type={'validator'} image={validator} name={'Validator'} text={'The agent responsible to handle disputes between the Company and the Client'} />
                    </Col>
                    <Col lg={4}>
                        <ProfileCard enter={this.enter} type={'company'} image={company} name={'Company'} text={'The agent responsible to execute the work defined in the smart-auction and receive the payments'} />
                    </Col>
                </Row>              
            </Container>
        )
    }

}



function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

ProfilePickerPage.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(ProfilePickerPage);

