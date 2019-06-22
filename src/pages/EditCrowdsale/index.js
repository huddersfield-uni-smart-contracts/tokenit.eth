import React from 'react';
import { Col, Container, Row, Card, CardBody } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import { InputField, DropDownField, CalendarInputField } from '../../components/Input';
import { UserNetworkIcon, CompanyIcon, CropPortraitIcon, QuestionAnswerIcon, BookLockIcon, UserStarIcon, SignTextIcon, CalendarIcon, MoneyIcon, CircleIcon, CoinIcon } from 'mdi-react';
import APISingleton from '../../controllers/API';
import NumberFormat from 'react-number-format';
import { Button } from '@material-ui/core';
import Numbers from '../../services/numbers';
import _ from 'lodash';
import { crowdsaleStatusArray } from '../Crowdsales/containers/codes';
import StringWorkerSingleton from '../../services/string';
import { MenuItem } from '@material-ui/core';
import CrowdsaleInvestmentsTable from './containers/Table';
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

const defaultProps = {
    validators : [],
    companies : [],
    investors : [],
    validator_fee : 0,
    fee_percentage : 0.01,
    total_paid : 0,
    company : {},
    canEdit : false,
    investments : [],
    crowdsale_address : '0x',
    investment : false
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

let editables = {
    'company' : [],
    'investor' : []
}

function isEditable(typeOfUser,type){
    let index = editables[typeOfUser].indexOf(new String(type).toLowerCase());
    return index > -1 ? true : false;
}

let params = {
    'company' : [],
    'investor' : ['company', 'investment']
}


function checkParams(type, state){
    return params[type].reduce( (acc, item) =>(acc && state[item]), true)
}

class EditCrowdsale extends React.Component{

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
        let { profile } = props;
        let editableCrowdsale = profile.getEditableCrowdsale();
        this.setState({...this.state, 
            ...editableCrowdsale,
            isEdit : true,
            type : new String(props.profile.getType()).toLowerCase(),
            investments : profile.getInvestmentsByCrowdsale(editableCrowdsale.crowdsale_address),
            validators : APISingleton.getAllByType('validator'),
            companies : APISingleton.getAllByType('company'),
            investors   : APISingleton.getAllByType('investor')
        })
    }

    edit = async () => {
        const { profile } = this.props;
        console.log(this.state.crowdsale_address);
        let crowdsale = APISingleton.getCrowdsaleByCrowdsaleAddress(this.state.crowdsale_address);
        console.log(crowdsale)
        if(this.state.type == 'investor'){
            await profile.closeCrowdsale({
                crowdsale : { ...crowdsale, ...this.state},
                investment_accepted : this.state.investment
            })
        }else{
            await profile.editCrowdsale({...crowdsale, ...this.state})
        }
        // Clean State
        this.state = null;
        this.props.history.push(`/${new String(profile.getType()).toLowerCase()}/crowdsales`);
    }

    setInvestment = (investment) => {
        this.onChange({type : 'investment', value : investment});
    }

    
    onChange = async ({type, value}) => {
        let canEdit = checkParams(this.state.type, {...this.state, [type] : value});
        var company = this.state.company, state = this.state.state;
        if(type == 'state'){ state = value}
        if(type == 'investment'){
            company = value.company;
            state = 'Finalize';
        }
        this.setState({...this.state, [type] : value, canEdit, company, state})
    }


    render = () => {
        if(_.isEmpty(this.props.profile)){return null};
        if(!this.props.profile.isEditing()){return null}
        if(!this.state.isEdit){return null}

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
                                    <CompanyIcon className='icon-left'/>
                                    <InputField
                                        id="name"
                                        value={this.state.crowdsale_name}
                                        type={'crowdsale_name'}
                                        disabled={!isEditable(this.state.type, 'crowdsale_name')}
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="Crowdsale Name"
                                        placeholder="Energy Crowdsale"
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
                                        disabled
                                        value={this.state.token_price}
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
                                        disabled
                                        value={this.state.token_amount}
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
                                        disabled
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
                                        disabled
                                        value={this.state.start_date}
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
                                        disabled
                                        value={this.state.end_date}
                                        onChange={this.onChange}
                                        options={this.state.investors}
                                        style={{width : '80%'}}
                                        label="End Date"
                                    /> 
                                </div>
                            </Col>
                        </Row>                        
                        <CrowdsaleInvestmentsTable setInvestment={this.setInvestment} {...this.props} crowdsales={this.state.investments}/>
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

EditCrowdsale.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(EditCrowdsale);

