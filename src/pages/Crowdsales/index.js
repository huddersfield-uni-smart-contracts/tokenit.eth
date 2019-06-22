import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import CrowdsalesTable from './containers/Table';

class Crowdsales extends React.Component{

    constructor(props){
        super(props)
    }


    render = () => {
        const {profile} = this.props;
        return (
            <Container className="dashboard">
                <CrowdsalesTable {...this.props} crowdsales={profile.getCrowdsales()}/>
            </Container>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

Crowdsales.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(Crowdsales);

