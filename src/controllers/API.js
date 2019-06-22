import Cache from "../services/cache";
import _  from 'lodash';
import Numbers from "../services/numbers";

class API{
    constructor() {        
    }

    /* TYPES OF USERS */

    getAllByType = (type) => {
        let array =  Cache.getFromCache(`${new String(type).toLowerCase()}/all`);
        if(!array){return []};
        return array;
    }

    addToAllByType = (object, type) => {
        var array = this.getAllByType(type);
        if(!_.isArray(array)){array = []}
        array.push(object);
        Cache.setToCache(`${type}/all`, array);
        return array;
    }

    /* AUCTIONS */

    getAllCrowdsales = () => {
        let array =  Cache.getFromCache(`all/Crowdsales`);
        if(!array){return []};
        return array;
    }

    getCrowdsalesByAddress = (address) => {
        let array =  Cache.getFromCache(`${new String(address).toLowerCase()}/Crowdsales`);
        if(!array){return []};
        return array;
    }

    getCrowdsaleByCrowdsaleAddress = (crowdsale_address) => {
        var address = crowdsale_address;
        let array = this.getAllCrowdsales();
        for (var i=0; i < array.length; i++) {
            if (new String(array[i].crowdsale_address).toLowerCase().trim() == new String(address).toLowerCase().trim() ) {
                return array[i];
            }
        }
        return null; 
    }
    
    addCrowdsaleByAddress = async (crowdsale, address) => {
        // Add to Type Crowdsale
        var array = this.getCrowdsalesByAddress(address);
        if(!array){array = []}
        array.push(crowdsale);
        await Cache.setToCache(`${new String(address).toLowerCase()}/Crowdsales`, array);
    }

    addCrowdsaleoToAll = async (crowdsale) => {
        // Add to All Crowdsales
        var all_array = this.getAllCrowdsales();
        if(!all_array){all_array = []}
        all_array.push(crowdsale);
        await Cache.setToCache(`all/Crowdsales`, all_array);
    }

    editCrowdsaleByAddress = async (crowdsaleObject, savableAddress) => {
        // Add to Type Crowdsale
        var crowdsale = crowdsaleObject;
        var array = this.getCrowdsalesByAddress(savableAddress);
        if(!array){array = []}
        for (var i=0; i < array.length; i++) {
            if (array[i].crowdsale_address == crowdsale.crowdsale_address) {
                array[i] = crowdsale;
            }
        }
        await Cache.setToCache(`${new String(savableAddress).toLowerCase()}/Crowdsales`, array);
    }

    editCrowdsalebyAll = async (crowdsaleObject) => {
        // Add to Type Crowdsale
        var crowdsale = crowdsaleObject;
        var array = this.getAllCrowdsales();
        if(!array){array = []}
        for (var i=0; i < array.length; i++) {
            if (array[i].crowdsale_address == crowdsale.crowdsale_address) {
                array[i] = crowdsale;
            }
        }
        await Cache.setToCache(`all/Crowdsales`, array);
    }

    /* BIDS */

    addInvestmentByCrowdsaleByAddress = async (investment, crowdsale_address) => {
        // Add to Type Crowdsale
        var crowdsale = this.getCrowdsaleByCrowdsaleAddress(crowdsale_address);
        if(!crowdsale.investments){crowdsale.investments = []}
        crowdsale.investments.push(investment);
        crowdsale.already_raised = Numbers.toFloat(crowdsale.investments.reduce( (acc, item) => acc+parseFloat(item.token_price)*parseFloat(item.token_buy_amount), 0));
        crowdsale.left_to_raise = Numbers.toFloat(crowdsale.total_raise - parseFloat(crowdsale.already_raised));
        // Closed Crodwsale
        if(crowdsale.already_raised == investment.total_raise){
            crowdsale.state = 'Closed';
        }
        return crowdsale;
    }

    editInvestmentByCrowdsaleByAddress =  async (investmentObject, crowdsale_address) => {
        // Add to Type Crowdsale
        var investment = investmentObject;
        var crowdsale = this.getCrowdsaleByCrowdsaleAddress(crowdsale_address);
        let investments = crowdsale.investments;
        if(!investments){investments = []}
        for (var i=0; i < investments.length; i++) {
            if (investments[i]._id == investment._id) {
                crowdsale.investments[i] = investment;
            }
        }
        return crowdsale;
    }


    getInvestmentsByCrowdsaleAddress = (crowdsale_address) => {
        // Add to Type Crowdsale
        var array = this.getAllCrowdsales();
        for (var i=0; i < array.length; i++) {
            if (array[i].crowdsale_address == crowdsale_address) {
                return array[i].investments;
            }
        }
    }
   

    getInvestmentsByAddress = (type, address) => {
        // Add to Type Crowdsale
        var array = this.getAllCrowdsales();
        let investments = [];
        for (var i=0; i < array.length; i++) {
            if(array[i].investments){
                for( var j=0; j < array[i].investments.length; j++){
                    let investment = array[i].investments[j];
                    if (investment[type] && (investment[type].address == address)) {
                        investments = investments.concat(investment)
                    }
                }
            }            
        }
        return investments;
    }
    
}

let APISingleton = new API();

export default APISingleton;