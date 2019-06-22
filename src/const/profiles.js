const validator = `${process.env.PUBLIC_URL}/img/validator.png`;
const investor = `${process.env.PUBLIC_URL}/img/investor.png`;
const company = `${process.env.PUBLIC_URL}/img/company.png`;


function getValidator(){
    return {
        name : 'James',
        type : 'validator',
        image : validator
    }
}


function getInvestor(){
    return {
        name : 'Jemery',
        type : 'investor',
        image : investor
    }
}


function getcompany(){
    return {
        name : 'Julian',
        type : 'company',
        image : company
    }
}


export {
    getValidator,
    getInvestor,
    getcompany
}