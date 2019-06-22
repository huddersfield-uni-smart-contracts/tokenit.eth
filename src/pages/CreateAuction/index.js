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
import randomHex from 'randomhex';
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

function genAddress(){
    return randomHex(16); // get 32 random bytes as HEX string (0x + 64 chars)
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
    bids : [],
    client : {}
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
['pba_name', 'workpackage_name', 'auction_name', 'payment_amount', 'validator_fee', 'validator',
'client', 'start_date', 'end_date', 'pay_date', 'state']

function checkParams(state){
    return params.reduce( (acc, item) =>(acc && state[item]), true)
}

class CreateAuction extends React.Component{

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
        this.setState({...this.state, 
            client : props.profile.getMe(),
            validators : APISingleton.getAllByType('validator'),
            companies : APISingleton.getAllByType('company'),
            clients   : APISingleton.getAllByType('client')
        })
    }

    create = async () => {
        const { profile } = this.props;
        await profile.saveAuction(this.state);
        // Clean State
        this.state = null;
        this.props.history.push(`/${new String(profile.getType()).toLowerCase()}/auctions`);
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
        return (
            <Container className="dashboard">
                <Card>
                    <CardBody style={{padding : 50}}>
                        <Row>
                            <Col lg={4}>
                                <h4> Auction </h4>
                                <img src={logo} style={{marginTop : 40, width : 200}} alt="" className="topbar__button-icon" />
                            </Col>
                        </Row>
                            <Row>
                            <Col lg={4}>
                            <div style={{marginTop : 20}}>
                                    <CompanyIcon className='icon-left'/>
                                    <InputField
                                        id="name"
                                        type={'pba_name'}
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="PBA Name"
                                        placeholder="Energy Auction"
                                    /> 
                                </div> 
                            </Col> 
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CropPortraitIcon className='icon-left'/>
                                    <InputField
                                        id="name"
                                        type={'workpackage_name'}
                                        onChange={this.onChange}
                                        style={{width : '80%'}}
                                        label="WorkPackage Name"
                                        placeholder="Workpackage name"
                                    /> 
                                </div>   
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <SignTextIcon className='icon-left'/>
                                    <InputField
                                        id="name"
                                        type={'auction_name'}
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
                                    <MoneyIcon className='icon-left'/>
                                    <InputField
                                        id="validator_fee"
                                        type={'validator_fee'}
                                        onChange={this.onChange}
                                        disabled
                                        placeholder={this.state.validator_fee}
                                        value={this.state.validator_fee}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                        style={{width : '80%'}}
                                        label="Validator Fee"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <BookLockIcon className='icon-left'/>
                                    <DropDownField
                                        id="validator"
                                        helperText={'Choose the Validator Name'}
                                        type={'validator'}
                                        onChange={this.onChange}
                                        options={this.state.validators}
                                        style={{width : '80%'}}
                                        label="Validator Name"
                                        >
                                        {this.state.validators.map(option => (
                                            <MenuItem key={option} value={option}>
                                                {option.name} ({ StringWorkerSingleton.toAddressConcat(option.address) })
                                            </MenuItem>
                                        ))}
                                        </DropDownField> 
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <UserStarIcon className='icon-left'/>
                                    <DropDownField
                                        id="client"
                                        helperText={'Choose the Client Name'}
                                        type={"client"}
                                        value={this.state.client.address}
                                        onChange={this.onChange}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        disabled
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
                        <Row>
                            <Col lg={4}>
                                <div style={{marginTop : 20}}>
                                    <CalendarIcon className='icon-left'/>
                                    <CalendarInputField
                                        id="calendar"
                                        type={"start_date"}
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
                                        onChange={this.onChange}
                                        options={this.state.clients}
                                        style={{width : '80%'}}
                                        label="Pay Date"
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Button 
                                    disabled={!this.state.canSend}
                                    onClick={() => this.create()} variant="contained" color="primary" className={'button-enter'}>
                                        Create Auction 
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

CreateAuction.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(CreateAuction);

