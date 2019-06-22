import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import InvestmentsTable from './containers/Table';

class Investments extends React.Component{

    constructor(props){
        super(props)
    }


    render = () => {
        const {profile} = this.props;
        return (
            <Container className="dashboard">
                <InvestmentsTable {...this.props} crowdsales={profile.getInvestments()}/>
            </Container>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

Investments.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(Investments);

