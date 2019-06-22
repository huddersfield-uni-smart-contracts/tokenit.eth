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
    investors : [],
    validator_fee : 0,
    fee_percentage : 0.01,
    state : 'Waiting for approval',
    total_paid : 0,
    investments : [],
    total_cost : 0,
    company : {},
    investor : {},
    state : 'Waiting'
}

let editables = ['work_end_date', 'investment_amount']

function isEditable(type){
    let index = editables.indexOf(new String(type).toLowerCase());
    return index > -1 ? true : false;
}


function NumberFormatCustom$(props) {
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
        />
    );
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
[ 'total_cost', 'token_buy_amount', 'investor' ]

function checkParams(state){
    return params.reduce( (acc, item) =>(acc && state[item]), true)
}

class CreateInvestment extends React.Component{

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
        let editableCrowdsale = profile.getEditableCrowdsale();
        this.setState({...this.state, 
            ...editableCrowdsale,
            state           : 'Done',
            isEdit          : true,
            investor        : props.profile.getMe(),
            validators      : APISingleton.getAllByType('validator'),
            companies       : APISingleton.getAllByType('company'),
            investors       : APISingleton.getAllByType('investor')
        })
    }

    create = async () => {
        const { profile } = this.props;
        await profile.addInvestmentByCrowdsaleByAddress(this.state, this.state.crowdsale_address);
        // Clean State
        this.state = null;
        this.props.history.push(`/${new String(profile.getType()).toLowerCase()}/investments`);
    }

    
    onChange = ({type, value}) => {
        let canSend = checkParams({...this.state, [type] : value});
        var total_cost = this.state.total_cost;
        if((type == 'token_buy_amount') && (value > 0)){
            total_cost = Numbers.toFloat(value*this.state.token_price);
        }
        // Total Raise Suprassed
        if(total_cost > this.state.left_to_raise){
            let max_token_buy = Numbers.toFloat(this.state.left_to_raise/this.state.token_price);
            this.setState({...this.state, token_buy_amount : max_token_buy, canSend, total_cost : this.state.left_to_raise});
            return null;
        }
        this.setState({...this.state, [type] : value, canSend, total_cost})
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
                                <h4> Create Investment </h4>
                                <img src={logo} style={{marginTop : 40, width : 200}} alt="" className="topbar__button-icon" />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <SignTextIcon className='icon-left'/>
                                    <InputField
                                        id="name"
                                        type={'crowdsale_name'}
                                        value={this.state.crowdsale_name}
                                        disabled={!isEditable('crowdsale_name')}
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="Crowdsale Name"
                                        placeholder="Crowdsale Crowdsale"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <MoneyIcon className='icon-left'/>
                                    <InputField
                                        id="token_price"
                                        type={'token_price'}
                                        value={this.state.token_price}
                                        disabled={!isEditable('token_price')}
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        style={{width : '80%'}}
                                        label="Token Price"
                                    /> 
                                </div>
                            </Col>
                        
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <UserStarIcon className='icon-left'/>
                                    <DropDownField
                                        id="investor"
                                        type={'investor'}
                                        value={this.state.investor.address}
                                        disabled={!isEditable('investor')}
                                        onChange={this.onChange}
                                        options={this.state.investors}
                                        style={{width : '80%'}}
                                        label="Investor Name"
                                        >
                                        {this.state.investors.map(option => (
                                            <MenuItem key={option.address} value={option.address}>
                                                {option.name} ({ StringWorkerSingleton.toAddressConcat(option.address) })
                                            </MenuItem>
                                        ))}
                                        </DropDownField> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <MoneyIcon className='icon-left'/>
                                    <InputField
                                        id="total_raise"
                                        type={'total_raise'}
                                        value={this.state.total_raise}
                                        disabled={!isEditable('total_raise')}
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        style={{width : '80%'}}
                                        label="($) Total Token Raise"
                                    /> 
                                </div>
                            </Col>         
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col lg={4}>
                                    <div style={{marginTop : 20}}>
                                        <MoneyIcon className='icon-left'/>
                                        <InputField
                                            id="token_buy_amount"
                                            type={'token_buy_amount'}
                                            value={this.state.token_buy_amount}
                                            onChange={this.onChange}
                                            style={{width : '80%'}}
                                            InputProps={{
                                                inputComponent: NumberFormatCustom$,
                                            }}
                                            label="Token Buy Amount"
                                        /> 
                                    </div>
                                </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <MoneyIcon className='icon-left'/>
                                    <InputField
                                        id="total_cost"
                                        type={'investment_amount'}
                                        value={this.state.total_cost}
                                        disabled
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        style={{width : '80%'}}
                                        label="Total Cost"
                                    /> 
                                </div>
                            </Col>
                           
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Button 
                                    disabled={!this.state.canSend}
                                    onClick={() => this.create()} variant="contained" color="primary" className={'button-enter'}>
                                        Create Investment 
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

CreateInvestment.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(CreateInvestment);

