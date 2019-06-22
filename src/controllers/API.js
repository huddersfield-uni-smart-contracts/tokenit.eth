import Cache from "../services/cache";
import _  from 'lodash';

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

    getAllAuctions = () => {
        let array =  Cache.getFromCache(`all/Auctions`);
        if(!array){return []};
        return array;
    }

    getAuctionsByAddress = (address) => {
        let array =  Cache.getFromCache(`${new String(address).toLowerCase()}/Auctions`);
        if(!array){return []};
        return array;
    }

    getAuctionByAuctionAddress = (auction_address) => {
        var address = auction_address;
        let array = this.getAllAuctions();
        for (var i=0; i < array.length; i++) {
            if (new String(array[i].auction_address).toLowerCase().trim() == new String(address).toLowerCase().trim() ) {
                return array[i];
            }
        }
        return null; 
    }
    
    addAuctionByAddress = async (auction, address) => {
        // Add to Type Auction
        var array = this.getAuctionsByAddress(address);
        if(!array){array = []}
        array.push(auction);
        await Cache.setToCache(`${new String(address).toLowerCase()}/Auctions`, array);
    }

    addAuctionoToAll = async (auction) => {
        // Add to All Auctions
        var all_array = this.getAllAuctions();
        if(!all_array){all_array = []}
        all_array.push(auction);
        await Cache.setToCache(`all/Auctions`, all_array);
    }

    editAuctionByAddress = async (auctionObject, savableAddress) => {
        // Add to Type Auction
        var auction = auctionObject;
        var array = this.getAuctionsByAddress(savableAddress);
        if(!array){array = []}
        for (var i=0; i < array.length; i++) {
            if (array[i].auction_address == auction.auction_address) {
                array[i] = auction;
            }
        }
        await Cache.setToCache(`${new String(savableAddress).toLowerCase()}/Auctions`, array);
    }

    editAuctionbyAll = async (auctionObject) => {
        // Add to Type Auction
        var auction = auctionObject;
        var array = this.getAllAuctions();
        if(!array){array = []}
        for (var i=0; i < array.length; i++) {
            if (array[i].auction_address == auction.auction_address) {
                array[i] = auction;
            }
        }
        await Cache.setToCache(`all/Auctions`, array);
    }

    /* BIDS */

    addBidByAuctionByAddress = async (bid, auction_address) => {
        // Add to Type Auction
        var auction = this.getAuctionByAuctionAddress(auction_address);
        if(!auction.bids){auction.bids = []}
        auction.bids.push(bid);
        return auction;
    }

    editBidByAuctionByAddress =  async (bidObject, auction_address) => {
        // Add to Type Auction
        var bid = bidObject;
        var auction = this.getAuctionByAuctionAddress(auction_address);
        let bids = auction.bids;
        if(!bids){bids = []}
        for (var i=0; i < bids.length; i++) {
            if (bids[i]._id == bid._id) {
                auction.bids[i] = bid;
            }
        }
        return auction;
    }


    getBidsByAuctionAddress = (auction_address) => {
        // Add to Type Auction
        var array = this.getAllAuctions();
        for (var i=0; i < array.length; i++) {
            if (array[i].auction_address == auction_address) {
                return array[i].bids;
            }
        }
    }
   

    getBidsByAddress = (type, address) => {
        // Add to Type Auction
        var array = this.getAllAuctions();
        let bids = [];
        for (var i=0; i < array.length; i++) {
            if(array[i].bids){
                for( var j=0; j < array[i].bids.length; j++){
                    let bid = array[i].bids[j];
                    if (bid[type] && (bid[type].address == address)) {
                        bids = bids.concat(bid)
                    }
                }
            }            
        }
        return bids;
    }
    
}

let APISingleton = new API();

export default APISingleton;