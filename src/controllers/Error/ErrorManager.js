class ErrorManager{
    constructor(){

    }


    checkErrors = (type, object) => {
        return true;
    }
}

let ErrorManagerSingleton = new ErrorManager();

export default ErrorManagerSingleton;