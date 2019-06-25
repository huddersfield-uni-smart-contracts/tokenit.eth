const pageAccess = {
    'company' : {
        home : true,
        createCrowdsale : true,
        editCrowdsale : false,
        crowdsales : true,
        investments : false,
        allCrowdsales : false,
        createInvestment : false
    },
    'validator' : {
        home : true,
        createCrowdsale : false,
        editCrowdsale : false,
        crowdsales : false,
        investments : false,
        allCrowdsales : true,
        createInvestment : false
    },
    'investor' : {
        home : true,
        createCrowdsale : false,
        editCrowdsale : false,
        crowdsales : false,
        investments : true,
        allCrowdsales : true,
        createInvestment : false
    },
}

export default pageAccess;