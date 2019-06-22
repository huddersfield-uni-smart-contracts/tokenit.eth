import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import AllAuctionsTable from './containers/Table';

class AllAuctions extends React.Component{

    constructor(props){
        super(props)
    }


    render = () => {
        const {profile} = this.props;
        return (
            <Container className="dashboard">
                <AllAuctionsTable {...this.props} auctions={profile.getAllAuctions()}/>
            </Container>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile
    };
}

AllAuctions.propTypes = {
    t: PropTypes.func.isRequired
};


export default compose(
    translate('common'),
    connect(mapStateToProps)
)(AllAuctions);

