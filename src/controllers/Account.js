import store from "../containers/App/store";
import { setProfileInfo } from "../redux/actions/profile";
import Cache from "../services/cache";
import ErrorManagerSingleton from "./Error/ErrorManager";
import APISingleton from "./API";

const defaultState = {
    address : '0x',
    name : 'none'
}

class Account{    
    constructor(params){
        this.params = {...defaultState, ...params}
        this.logged = false;
        this.editing = false;
    }

    getMe = () => {
        return this.params;
    }

    getAccount = () => {
        if(!this.getType()){return false;}
        let params = Cache.getFromCache(this.getType());
        if(params){ this.params = params; this.logged = true; }
        return true;
    } 

    startAccount = async () => {
        try{
            this.checkErrors('Login', this.params);
            Cache.setToCache(this.getType() ,this.params);
            return await this.update();
        }catch(err){
            console.log(err);
            // TODO : Message Notification
        }    
    }

    login = async ({name, address}) => {
        try{
            this.params = { ...this.params, name, address };
            this.logged = true;
            // Add to API
            APISingleton.addToAllByType(this.params, this.getType());
            await this.startAccount();
        }catch(err){
            console.log(err);
            // TODO : Message Notification
        }    
    }

    getAddress = () => this.params.address;
    
    getName = () => this.params.name;
    
    isLogged = () => this.logged;

    update = async () => {
        /* if(this.logged){
            this.crowdsales = await this.getCrowdsales();
        } */
        /* Add Everything to the Redux State */  
        return await store.dispatch(setProfileInfo(this));
    }

    isSet = () => {
        return (Object.keys(this.params).length > 0) ? true : false;
    }

    setProfileData = (data) => {
        this.User = data;
    }

    getUsername = () => {
        return this.params.name;
    }

    getImage = () => {
        return this.params.image;
    }

    getType = () => {
        if(this.params)
            return new String(this.params.type).toLowerCase();
        else
            return null;
    }

    setTimer = () => {
        clearTimeout(this.timer);
        this.timer = setInterval(
            () => {
            this.getData();
        }, 2000);
    }

    checkErrors = (type, object) => {
        ErrorManagerSingleton.checkErrors(type, object)
    }

    getCrowdsales = () => {
        return APISingleton.getCrowdsalesByAddress(this.params.address);
    }
    
    getAllCrowdsales = () => {
        return APISingleton.getAllCrowdsales();
    }

    getTotalAmountFromCrowdsales = () => {
        let crowdsales = APISingleton.getCrowdsalesByAddress(this.params.address);
        return crowdsales.reduce( (acc, item) => {
            return parseInt(acc)+parseInt(item.payment_amount);
        }, 0)
    }

    getInvestmentsByCrowdsale = (crowdsale_address) => {
        return APISingleton.getInvestmentsByCrowdsaleAddress(crowdsale_address) || [];
    }

    getInvestments = () => {
        return APISingleton.getInvestmentsByAddress(this.getType(), this.getAddress()) || [];
    }

    getEditableCrowdsale = () => {
        return this.editableCrowdsale;
    }

    setEditingCrowdsale = (crowdsale) => {
        this.editableCrowdsale = crowdsale;
        this.editing = true;
    }

    isEditing = () => {
        return this.editing;
    }

    editCrowdsale = async (crowdsale) => {
        try{
            if(crowdsale['investor'])
                await APISingleton.editCrowdsaleByAddress(crowdsale, crowdsale['investor'].address);
            await APISingleton.editCrowdsaleByAddress(crowdsale, crowdsale['company'].address);
            await APISingleton.editCrowdsalebyAll(crowdsale);
            await this.update();
            this.editing = false;
        }catch(err){
            console.log(err)
        }
    }

    saveCrowdsale = async (crowdsale) => {
        await APISingleton.addCrowdsaleByAddress(crowdsale, crowdsale['company'].address);
        await APISingleton.addCrowdsaleoToAll(crowdsale);
        await this.update();
        return true;
    }

    addInvestmentByCrowdsaleByAddress = async (investment, crowdsale_address) => {
        let crowdsale = await APISingleton.addInvestmentByCrowdsaleByAddress(investment, crowdsale_address);
        await this.editCrowdsale(crowdsale);
        await this.update();
        return true;
    }

    closeCrowdsale = async ({crowdsale, investment_accepted}) => {
        for(var i = 0; i < crowdsale['investments'].length; i++){
            if(investment_accepted._id == crowdsale['investments'][i]._id){
                crowdsale['investments'][i] = {...crowdsale['investments'][i], state : 'Accepted'};  
            }else{
                crowdsale['investments'][i] = {...crowdsale['investments'][i], state : 'Rejected'};
            }
        }
        await this.editCrowdsale(crowdsale);
    }

    editInvestmentByCrowdsaleByAddress = async (investment, crowdsale_address) => {
        try{
            let crowdsale = await APISingleton.editInvestmentByCrowdsaleByAddress(investment, crowdsale_address);
            this.editCrowdsale(crowdsale);
            await this.update();
            return true;
        }catch(err){
            console.log(err);
        }
    }

    logout = async () => {
        Cache.setToCache(this.getType(), null);
        this.logged = false;
        return await this.update();
    }

}

export default Account;