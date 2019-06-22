const validator = `${process.env.PUBLIC_URL}/img/validator.png`;
const client = `${process.env.PUBLIC_URL}/img/client.png`;
const company = `${process.env.PUBLIC_URL}/img/company.png`;


function getValidator(){
    return {
        name : 'James',
        type : 'validator',
        image : validator
    }
}


function getClient(){
    return {
        name : 'Jemery',
        type : 'client',
        image : client
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
    getClient,
    getcompany
}