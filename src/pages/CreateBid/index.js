import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import { InputField, DropDownField, CalendarInputField } from '../../components/Input';
import { UserNetworkIcon, CompanyIcon, CropPortraitIcon, BookLockIcon, UserStarIcon, SignTextIcon, CalendarIcon, MoneyIcon } from 'mdi-react';
import APISingleton from '../../controllers/API';
import NumberFormat from 'react-number-format';
import { Button, MenuItem } from '@material-ui/core';
import Numbers from '../../services/numbers';
import StringWorkerSingleton from '../../services/string';
import _ from 'lodash';
import randomHex from 'randomhex';
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

function idGen() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const defaultProps = {
    validators : [],
    companies : [],
    clients : [],
    validator_fee : 0,
    fee_percentage : 0.01,
    state : 'Waiting for approval',
    total_paid : 0,
    bids : [],
    company : {},
    client : {},
    state : 'Waiting'
}

let editables = ['work_end_date', 'bid_amount']

function isEditable(type){
    let index = editables.indexOf(new String(type).toLowerCase());
    return index > -1 ? true : false;
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

let params = 
[ 'work_end_date', 'bid_amount', 'company' ]

function checkParams(state){
    return params.reduce( (acc, item) =>(acc && state[item]), true)
}

class CreateBid extends React.Component{

    constructor(props){
        super(props)
        this.state = {...defaultProps,
            _id : idGen()
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        let { profile } = props;
        let editableAuction = profile.getEditableAuction();
        this.setState({...this.state, 
            ...editableAuction,
            state       : 'Waiting',
            isEdit      : true,
            company     : props.profile.getMe(),
            validators  : APISingleton.getAllByType('validator'),
            companies   : APISingleton.getAllByType('company'),
            clients     : APISingleton.getAllByType('client')
        })
    }

    create = async () => {
        const { profile } = this.props;
        await profile.addBidByAuctionByAddress(this.state, this.state.auction_address);
        // Clean State
        this.state = null;
        this.props.history.push(`/${new String(profile.getType()).toLowerCase()}/bids`);
    }

    
    onChange = ({type, value}) => {
        let canSend = checkParams({...this.state, [type] : value});
        var validator_fee = this.state.validator_fee;
        if((type == 'payment_amount') && (value > 0)){
                validator_fee = Numbers.toFloat(value*this.state.fee_percentage);
        }
        this.setState({...this.state, [type] : value, canSend, validator_fee})
    }


    render = () => {
        if(_.isEmpty(this.props.profile)){return null};
        if(!this.props.profile.isEditing()){return null};
        if(!this.state.isEdit){return null};

        return (
            <Container className="dashboard">
                <Card>
                    <CardBody style={{padding : 50}}>
                        <Row>
                            <Col lg={4}>
                                <h4> Create Bid </h4>
                                <img src={logo} style={{marginTop : 40, width : 200}} alt="" className="topbar__button-icon" />
                            </Col>
                        </Row>
                            <Row>
                                <Col lg={4}>
                                    <div style={{marginTop : 20}}>
                                        <SignTextIcon className='icon-left'/>
                                        <InputField
                                            id="name"
                                            type={'auction_name'}
                                            value={this.state.auction_name}
                                            disabled={!isEditable('auction_name')}
                                            onChange={this.onChange}
                                            style={{width : '80%'}}
                                            label="Auction Name"
                                            placeholder="Auction Auction"
                                        /> 
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div style={{marginTop : 20}}>
                                        <MoneyIcon className='icon-left'/>
                                        <InputField
                                            id="payment_amount"
                                            type={'payment_amount'}
                                            value={this.state.payment_amount}
                                            disabled={!isEditable('payment_amount')}
                                            onChange={this.onChange}
                                            InputProps={{
                                                inputComponent: NumberFormatCustom,
                                            }}
                                            style={{width : '80%'}}
                                            label="Payment Amount"
                                        /> 
                                    </div>
                                </Col>
                                <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <UserStarIcon className='icon-left'/>
                                    <DropDownField
                                        id="client"
                                        helperText={'Choose the Client Name'}
                                        type={'client'}
                                        value={this.state.client.address}
                                        disabled={!isEditable('client')}
                                        onChange={this.onChange}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        label="Client Name"
                                        >
                                        {this.state.clients.map(option => (
                                            <MenuItem key={option.address} value={option.address}>
                                                {option.name} ({ StringWorkerSingleton.toAddressConcat(option.address) })
                                            </MenuItem>
                                        ))}
                                        </DropDownField> 
                                </div>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"start_date"}
                                        value={this.state.start_date}
                                        disabled={!isEditable('start_date')}
                                        onChange={this.onChange}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        label="Start Date"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"end_date"}
                                        value={this.state.end_date}
                                        disabled={!isEditable('end_date')}
                                        onChange={this.onChange}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        label="End Date"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"pay_date"}
                                        disabled={!isEditable('pay_date')}
                                        onChange={this.onChange}
                                        value={this.state.pay_date}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        label="Pay Date"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <UserStarIcon className='icon-left'/>
                                    <DropDownField
                                        id="company"
                                        type={'company'}
                                        value={this.state.company.address}
                                        onChange={this.onChange}
                                        disabled
                                        options={this.state.companies}
                                        style={{width : '80%'}}
                                        label="Company Name"
                                        >
                                        {this.state.companies.map(option => (
                                            <MenuItem key={option.address} value={option.address}>
                                                {option.name} ({ StringWorkerSingleton.toAddressConcat(option.address) })
                                            </MenuItem>
                                        ))}
                                        </DropDownField> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <MoneyIcon className='icon-left'/>
                                    <InputField
                                        id="bid_amount"
                                        type={'bid_amount'}
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        style={{width : '80%'}}
                                        label="Bid Amount"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"work_end_date"}
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="Work End Date"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Button 
                                    disabled={!this.state.canSend}
                                    onClick={() => this.create()} variant="contained" color="primary" className={'button-enter'}>
                                        Create Bid 
                                </Button>       
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

CreateBid.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(CreateBid);

