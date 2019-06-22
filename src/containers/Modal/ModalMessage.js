import React from 'react';
import { Card, CardBody, Col, Row, Container } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'

class ModalMessage extends React.Component{

    constructor(props){
        super(props)
    }


    close = async () => {
       
    }

    render = () => {
        if(!this.props.message){return null};

        return (
            <Container>
                <p>Message</p>          
            </Container>
        )
    }

}



function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

ModalMessage.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(ModalMessage);

