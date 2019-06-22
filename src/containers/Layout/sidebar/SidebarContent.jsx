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
            auctions : true,
            createAuction : true,
            editAuction : true,
            home : true,
            bids : true,
            allAuctions : true,
            createBid : true
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
                    {this.render_tab({disabled : !this.state.createAuction, icon : faFileInvoice, title : 'Create Auction', route :`/${type}/createAuction`})}
                    {this.render_tab({disabled : !this.state.createBid, icon : faCertificate, title : 'Create Bid', route :`/${type}/createBid`})}
                    {this.render_tab({disabled : !this.state.editAuction, icon : faFileExport, title : 'Edit Auction', route : `/${type}/editAuction`})}
                    {this.render_tab({disabled : !this.state.auctions, icon : faFileContract, title : 'My Auctions', route : `/${type}/auctions`})}
                    {this.render_tab({disabled : !this.state.allAuctions, icon : faFileContract, title : 'All Auctions', route : `/${type}/allAuctions`})}
                    {this.render_tab({disabled : !this.state.bids, icon : faIndustry, title : 'My Bids', route : `/${type}/bids`})}
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