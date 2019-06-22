import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import { InputField, DropDownField, CalendarInputField } from '../../components/Input';
import { UserNetworkIcon, CompanyIcon, CropPortraitIcon, BookLockIcon, UserStarIcon, SignTextIcon, CalendarIcon, MoneyIcon, UsersIcon } from 'mdi-react';
import APISingleton from '../../controllers/API';
import NumberFormat from 'react-number-format';
import { Button, MenuItem } from '@material-ui/core';
import Numbers from '../../services/numbers';
import keythereum from "keythereum";
import StringWorkerSingleton from '../../services/string';

const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

function genAddress(){
    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    var keyDump = keythereum.dump("password123", dk.privateKey, dk.salt, dk.iv);
    return  "0x" + keyDump.address;
}

const defaultProps = {
    validators : [],
    companies : [],
    clients : [],
    validator_fee : 0,
    fee_percentage : 0.01,
    state : 'Waiting for approval',
    total_paid : 0,
    auction_address : genAddress(),
    myAuctions : [],
    name        : 'none',
    address     : '0x',
    type        : 'none',
    amount      : 0
}



function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
            onChange({
            target: {
                value: values.value,
            },
            });
        }}
        thousandSeparator
        prefix="$"
        />
    );
}

class EntryPage extends React.Component{

    constructor(props){
        super(props)
        this.state = {...defaultProps}
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        const { profile } = props;
        this.setState({...this.state, 
            validators : APISingleton.getAllByType('validator'),
            companies   : APISingleton.getAllByType('company'),
            clients     : APISingleton.getAllByType('client'),
            myAuctions : profile.getAuctions(),
            name        : profile.getName(),
            address     : profile.getAddress(),
            type        : profile.getType(),
            amount      : profile.getTotalAmountFromAuctions()
        })
    }

    render = () => {
        return (
            <Container className="dashboard">
                <Row>
                    <Col lg={4}>
                        <Card>
                            <CardBody style={{padding : 50}}>
                                <h3>Welcome {StringWorkerSingleton.titleCase(this.state.name)} </h3>
                                <p>You are a {StringWorkerSingleton.titleCase(this.state.type)}</p>
                                <img src={logo} style={{width : 200, marginTop : 30}} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <CardBody style={{padding : 50}}>
                                <hr></hr>
                                <br></br>
                                <h4>Amount Staked on your Auctions</h4>
                                <h4 style={{marginTop : 20}}>
                                 ${StringWorkerSingleton.toNumber(this.state.amount)}</h4>
                                 <MoneyIcon size={40}/>
                            </CardBody>
                        </Card>
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

EntryPage.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(EntryPage);

