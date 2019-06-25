import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import { connect } from "react-redux";
import { compose } from 'lodash/fp'
import Layout from '../Layout';
import { Route, Switch } from 'react-router-dom';

import Crowdsales from '../../pages/Crowdsales';
import CreateCrowdsale from '../../pages/CreateCrowdsale';
import Account from '../../controllers/Account';
import _ from 'lodash'
import EditCrowdsale from '../../pages/EditCrowdsale';
import EntryPage from '../../pages/EntryPage';
import Investments from '../../pages/Investments';
import AllCrowdsales from '../../pages/AllCrowdsales';
import CreateInvestment from '../../pages/CreateInvestment';

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
                    <Route path={'/validator/allCrowdsales'} component={AllCrowdsales}/>	
                    <Route path={'/validator/editCrowdsale'} component={EditCrowdsale}/>	
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
                    <Route path={'/company/createCrowdsale'} component={CreateCrowdsale}/>	
                    <Route path={'/company/editCrowdsale'} component={EditCrowdsale}/>	
                    <Route path={'/company/crowdsales'} component={Crowdsales}/>	
                    <Route path={'/company/investments'} component={Investments}/>	
                </div>
            </div>
        )
    }

    investorRoutes = () => {
        return(
            <div>
                <Layout />
                <div className="container__wrap">
                    <Route exact path={'/investor'} component={EntryPage}/>
                    <Route path={'/investor/allCrowdsales'} component={AllCrowdsales}/>	
                    <Route path={'/investor/investments'} component={Investments}/>	
                    <Route path={'/investor/createInvestment'} component={CreateInvestment}/>	

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
                            type == 'investor'    ? this.investorRoutes(this.props) : 
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