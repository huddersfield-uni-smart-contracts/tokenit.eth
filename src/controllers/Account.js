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
            this.auctions = await this.getAuctions();
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

    getAuctions = () => {
        return APISingleton.getAuctionsByAddress(this.params.address);
    }
    
    getAllAuctions = () => {
        return APISingleton.getAllAuctions();
    }

    getTotalAmountFromAuctions = () => {
        let auctions = APISingleton.getAuctionsByAddress(this.params.address);
        return auctions.reduce( (acc, item) => {
            return parseInt(acc)+parseInt(item.payment_amount);
        }, 0)
    }

    getBidsByAuction = (auction_address) => {
        return APISingleton.getBidsByAuctionAddress(auction_address) || [];
    }

    getBids = () => {
        return APISingleton.getBidsByAddress(this.getType(), this.getAddress()) || [];
    }

    getEditableAuction = () => {
        return this.editableAuction;
    }

    setEditingAuction = (auction) => {
        this.editableAuction = auction;
        this.editing = true;
    }

    isEditing = () => {
        return this.editing;
    }

    editAuction = async (auction) => {
        try{
            if(auction['company'])
                await APISingleton.editAuctionByAddress(auction, auction['company'].address);
            await APISingleton.editAuctionByAddress(auction, auction['client'].address);
            await APISingleton.editAuctionByAddress(auction, auction['validator'].address);
            await APISingleton.editAuctionbyAll(auction);
            await this.update();
            this.editing = false;
        }catch(err){
            console.log(err)
        }
    }

    saveAuction = async (auction) => {
        if(auction['company'])
            await APISingleton.addAuctionByAddress(auction, auction['company'].address);
        await APISingleton.addAuctionByAddress(auction, auction['client'].address);
        await APISingleton.addAuctionByAddress(auction, auction['validator'].address);
        await APISingleton.addAuctionoToAll(auction);
        await this.update();
        return true;
    }

    addBidByAuctionByAddress = async (bid, auction_address) => {
        let auction = await APISingleton.addBidByAuctionByAddress(bid, auction_address);
        await this.editAuction(auction);
        await this.update();
        return true;
    }

    closeAuction = async ({auction, bid_accepted}) => {
        for(var i = 0; i < auction['bids'].length; i++){
            if(bid_accepted._id == auction['bids'][i]._id){
                auction['bids'][i] = {...auction['bids'][i], state : 'Accepted'};  
            }else{
                auction['bids'][i] = {...auction['bids'][i], state : 'Rejected'};
            }
        }
        await this.editAuction(auction);
    }

    editBidByAuctionByAddress = async (bid, auction_address) => {
        try{
            let auction = await APISingleton.editBidByAuctionByAddress(bid, auction_address);
            this.editAuction(auction);
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