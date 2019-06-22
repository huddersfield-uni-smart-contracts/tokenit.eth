import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { connect } from "react-redux";
import { compose } from 'lodash/fp';
import _ from 'lodash';
import { faFileContract, faFileInvoice, faFileExport, faHome, faIndustry, faCertificate } from '@fortawesome/free-solid-svg-icons'
import pageAccess from './pageAccess';


class SidebarContent extends Component {
    static propTypes = {
        changeToDark: PropTypes.func.isRequired,
        changeToLight: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    constructor(props){
        super(props)
        this.state = {
            crowdsales : true,
            createCrowdsale : true,
            editCrowdsale : true,
            home : true,
            investments : true,
            allCrowdsales : true,
            createInvestment : true
        }
    }

    hideSidebar = () => {
        this.props.onClick();
    };

    componentWillReceiveProps(props){
        this.getData(props)
    }

    getData = (props) => {
        let type = props.profile.getType();
        let newState = { ...pageAccess[type] };
        this.setState({...this.state, ...newState})
    }

    render_tab = ({disabled, icon, route, title}) => {
        return !disabled ? <SidebarLink disabled={disabled} title={title} icon={icon} route={route} onClick={this.hideSidebar} /> : null
    }

    render() {
        let type = new String(this.props.profile.getType()).toLowerCase();

        return (
            <div className="sidebar__content">
                <ul className="sidebar__block">
                    {this.render_tab({disabled : !this.state.home, icon : faHome, title : 'Home Page', route : `/${type}`})}
                    {this.render_tab({disabled : !this.state.createCrowdsale, icon : faFileInvoice, title : 'Create Crowdsale', route :`/${type}/createCrowdsale`})}
                    {this.render_tab({disabled : !this.state.createInvestment, icon : faCertificate, title : 'Create Investment', route :`/${type}/createInvestment`})}
                    {this.render_tab({disabled : !this.state.editCrowdsale, icon : faFileExport, title : 'Edit Crowdsale', route : `/${type}/editCrowdsale`})}
                    {this.render_tab({disabled : !this.state.crowdsales, icon : faFileContract, title : 'My Crowdsales', route : `/${type}/crowdsales`})}
                    {this.render_tab({disabled : !this.state.allCrowdsales, icon : faFileContract, title : 'All Crowdsales', route : `/${type}/allCrowdsales`})}
                    {this.render_tab({disabled : !this.state.investments, icon : faIndustry, title : 'My Investments', route : `/${type}/investments`})}
                </ul>        
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        profile: state.profile
    };
}


export default compose(
    connect(mapStateToProps)
)(SidebarContent);