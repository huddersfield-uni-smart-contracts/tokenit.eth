import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import { InputField, DropDownField, CalendarInputField } from '../../components/Input';
import { UserNetworkIcon, CompanyIcon, CropPortraitIcon, BookLockIcon, UserStarIcon, SignTextIcon, CalendarIcon, MoneyIcon, CircleIcon, CoinIcon } from 'mdi-react';
import APISingleton from '../../controllers/API';
import NumberFormat from 'react-number-format';
import { Button, MenuItem } from '@material-ui/core';
import Numbers from '../../services/numbers';
import StringWorkerSingleton from '../../services/string';
import randomHex from 'randomhex';
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

function genAddress(){
    return randomHex(16); // get 32 random bytes as HEX string (0x + 64 chars)
}

const defaultProps = {
    validators : [],
    companies : [],
    investors : [],
    state : 'Open',
    left_to_raise : 0,
    total_paid : 0,
    company : {},
    token_amount : 0,
    total_raise : 0,
    token_price : 0,
    already_raised : 0,
    investments : [],
    investor : {}
}





function NumberFormatCustom(props) {
    const { inputRef, onChange, prefix, ...other} = props;

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



function NumberFormatCustom$(props) {
    const { inputRef, onChange, prefix, ...other} = props;

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
        prefix={'$'}
        />
    );
}


let params = ['crowdsale_name', 'token_price', 'start_date', 'end_date', 'state', 'token_amount']

function checkParams(state){
    return params.reduce( (acc, item) =>(acc && state[item]), true)
}

class CreateCrowdsale extends React.Component{

    constructor(props){
        super(props)
        this.state = {...defaultProps,
            crowdsale_address : genAddress()
        }
    }

    componentDidMount(){
        this.projectData(this.props)
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = (props) => {
        this.setState({...this.state, 
            company : props.profile.getMe(),
            validators : APISingleton.getAllByType('validator'),
            companies : APISingleton.getAllByType('company'),
            investors   : APISingleton.getAllByType('investor')
        })
    }

    create = async () => {
        const { profile } = this.props;
        await profile.saveCrowdsale({...this.state, left_to_raise : this.state.total_raise});
        // Clean State
        this.state = null;
        this.props.history.push(`/${new String(profile.getType()).toLowerCase()}/crowdsales`);
    }

    
    onChange = ({type, value}) => {
        var total_raise = this.state.total_raise;
        if(type == 'token_price'){
            total_raise = Numbers.toFloat(parseFloat(value)*parseFloat(this.state.token_amount));
        }
        if(type == 'token_amount'){
            total_raise = Numbers.toFloat(parseFloat(this.state.token_price)*parseFloat(value));
        }

        let canSend = checkParams({...this.state, [type] : value});
        this.setState({...this.state, [type] : value, canSend, total_raise})
    }


    render = () => {
        return (
            <Container className="dashboard">
                <Card>
                    <CardBody style={{padding : 50}}>
                        <Row>
                            <Col lg={4}>
                                <h4> Crowdsale </h4>
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
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="Crowdsale Name"
                                        placeholder="Crowdsale Crowdsale"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CompanyIcon className='icon-left'/>
                                    <DropDownField
                                        id="company"
                                        helperText={'Choose the Company Name'}
                                        type={'company'}
                                        value={this.state.company.address}
                                        disabled                                        
                                        onChange={this.onChange}
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
                        </Row>
                        <hr></hr>
                        <Row>
                           
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CoinIcon className='icon-left'/>
                                    <InputField
                                        id="token_price"
                                        type={'token_price'}
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom$,
                                          }}
                                        style={{width : '80%'}}
                                        label="Token Price"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CircleIcon className='icon-left'/>
                                    <InputField
                                        id="token_amount"
                                        type={'token_amount'}
                                        onChange={this.onChange}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                          }}
                                        style={{width : '80%'}}
                                        label="Token Amount"
                                    /> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CircleIcon className='icon-left'/>
                                    <InputField
                                        id="total_raise"
                                        type={'total_raise'}
                                        onChange={this.onChange}
                                        value={this.state.total_raise}
                                        disabled
                                        InputProps={{
                                            inputComponent: NumberFormatCustom$,
                                          }}
                                        style={{width : '80%'}}
                                        label="Total Raise"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"start_date"}
                                        onChange={this.onChange}
                                        options={this.state.investors}
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
                                        onChange={this.onChange}
                                        options={this.state.investors}
                                        style={{width : '80%'}}
                                        label="End Date"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Button 
                                    disabled={!this.state.canSend}
                                    onClick={() => this.create()} variant="contained" color="primary" className={'button-enter'}>
                                        Create Crowdsale 
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

CreateCrowdsale.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(CreateCrowdsale);

