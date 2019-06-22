import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import Layout from '../Layout';
import { Route, Switch } from 'react-router-dom';

import Auctions from '../../pages/Auctions';
import CreateAuction from '../../pages/CreateAuction';
import Account from '../../controllers/Account';
import _ from 'lodash'
import EditAuction from '../../pages/EditAuction';
import EntryPage from '../../pages/EntryPage';
import Bids from '../../pages/Bids';
import AllAuctions from '../../pages/AllAuctions';
import CreateBid from '../../pages/CreateBid';

class MainRoute extends React.Component {
	constructor() {
		super();
		this.state = {
            loaded : false,
            loading : true
		};
    }
    
    componentDidMount(){
        this.enterWebsite();
    }

	enterWebsite = async () => {
        var { profile } = this.props;
        if(_.isEmpty(profile)) { 
            profile = new Account(); 
        }
        if(profile.getAccount()){
            // Account already saved
            await profile.startAccount();
        };

        this.setState({ loading: false });
    }

    getName(object, path){
        return object.filter(obj => {
            return obj.path == path
        })[0]
    }

    getrouteHistoryObjects = (object, full_path) => {
        let paths = full_path.split("/").filter(el =>  el != "");
        let objectPaths = new Array();
    
        for(var i = 0; i < paths.length; i++){
            let search_object = i < 1 ? object : objectPaths[i-1].children;
            objectPaths.push(this.getName(search_object, "/" + paths[i]));
        }
    
        return objectPaths;
    
    }

    validatorRoutes = () => {
        return(
            <div>
                <Layout />
                <div className="container__wrap">
                    <Route exact path={'/validator'} component={EntryPage}/>
                    <Route path={'/validator/auctions'} component={Auctions}/>	
                    <Route path={'/validator/editAuction'} component={EditAuction}/>	
                </div>
            </div>
        )
    }

    companyRoutes = () => {
        return(
            <div>
                <Layout />
                <div className="container__wrap">
                    <Route exact path={'/company'} component={EntryPage}/>
                    <Route path={'/company/allAuctions'} component={AllAuctions}/>	
                    <Route path={'/company/bids'} component={Bids}/>	
                    <Route path={'/company/createBid'} component={CreateBid}/>	
                </div>
            </div>
        )
    }

    clientRoutes = () => {
        return(
            <div>
                <Layout />
                <div className="container__wrap">
                    <Route exact path={'/client'} component={EntryPage}/>
                    <Route path={'/client/createAuction'} component={CreateAuction}/>	
                    <Route path={'/client/editAuction'} component={EditAuction}/>	
                    <Route path={'/client/auctions'} component={Auctions}/>	
                    <Route path={'/client/bids'} component={Bids}/>	
                </div>
            </div>
        )
    }

	render() {

        if(_.isEmpty(this.props.profile)){
            this.props.history.push('/');
            return null;
        };
        let type = new String(this.props.profile.getType()).toLowerCase();
		return (
            <div>
             
                    <div>
                        {
                            type == 'validator' ? this.validatorRoutes(this.props) : 
                            type == 'company'   ? this.companyRoutes(this.props) : 
                            type == 'client'    ? this.clientRoutes(this.props) : 
                            null
                        }
                    </div>
               
            </div>
    )};
}


function mapStateToProps(state){
    return {
        profile: state.profile
    };
}


export default compose(
    connect(mapStateToProps)
)(MainRoute);