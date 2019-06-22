import React from 'react';
import { Card, CardBody, Col, Row, Container } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import {  TextField, Button } from '@material-ui/core';
import _ from 'lodash';
import { UserNetworkIcon, BitcoinIcon, AccountKeyIcon } from 'mdi-react';
import {InputField} from '../../components/Input';
import randomHex from 'randomhex';
const logo = `${process.env.PUBLIC_URL}/img/logo.png`;

function genAddress(){
    return randomHex(16); // get 32 random bytes as HEX string (0x + 64 chars)
}


const defaultProps = {
    canLogin : false,
    name : null,
    type : null,
    address : genAddress()
}

class ModalLogin extends React.Component{

    constructor(props){
        super(props)
        this.state = {...defaultProps }
    }

    close = async () => {
       
    }

    onChange = ({type, value}) => {
        let canLogin = (this.state.name && this.state.address);
        this.setState({...this.state, [type] : value, canLogin})
    }

    login = async () => {
        const { profile } = this.props;
        await profile.login(this.state);
    }

    render = () => {
        if(_.isEmpty(this.props.profile) || (!_.isEmpty(this.props.profile)) && this.props.profile.isLogged()){return null};

        const { profile } = this.props;
        let type = profile.getType();

        return (
            <div className='modal-login-outer'>
                <div className='modal-login-middle'>
                    <div className='modal-login'>
                        <Container >
                            <h3 className='modal-text'> Sign In </h3>
                            <div style={{marginTop : 20}}>
                                <UserNetworkIcon className='icon-left'/>
                                <InputField
                                    id="name"
                                    type={'name'}
                                    onChange={this.onChange}
                                    style={{width : '80%'}}
                                    label="Name"
                                    placeholder="Daniel"
                                /> 
                            </div>   
                            <div>
                                <BitcoinIcon className='icon-left'/>
                                <InputField
                                    onChange={this.onChange}
                                    id="address"
                                    type={'address'}
                                    style={{width : '80%'}}
                                    defaultValue={defaultProps.address}
                                    label="Address"
                                    placeholder="0xeA74FC2930236Cc19948f0CA1F734856D07b6e2b"
                                /> 
                            </div>     
                            <div>
                                <AccountKeyIcon className='icon-left'/>
                                <InputField
                                    onChange={this.onChange}
                                    disabled={true}
                                    id="type"
                                    type='type'
                                    style={{width : '80%'}}
                                    label={type}
                                    placeholder={type}
                                /> 
                            </div>     
                            <Button 
                            disabled={!this.state.canLogin}
                            onClick={() => this.login()} variant="contained" color="primary" className={'button-enter'}>
                                Enter
                            </Button>       
                        </Container>
                    </div>
                </div>
            </div>
        )
    }

}



function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

ModalLogin.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(ModalLogin);

