const pageAccess = {
    'client' : {
        home : true,
        createAuction : true,
        editAuction : false,
        auctions : true,
        bids : false,
        allAuctions : false,
        createBid : false
    },
    'validator' : {
        home : true,
        createAuction : false,
        editAuction : false,
        auctions : true,
        bids : false,
        allAuctions : false,
        createBid : false
    },
    'company' : {
        home : true,
        createAuction : false,
        editAuction : false,
        auctions : false,
        bids : true,
        allAuctions : true,
        createBid : false
    },
}

export default pageAccess;