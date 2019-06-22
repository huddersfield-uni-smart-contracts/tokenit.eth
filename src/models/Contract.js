class crowdsale{

    constructor(params){
        this.web3 = params.web3;
        this.abi = params.crowdsale.abi;
        this.address = params.address;
        this.json = params.crowdsale;
        this.crowdsale = new params.web3.eth.Crowdsale(params.crowdsale.abi, params.address)
    }

    async deploy(account, abi, byteCode, args=[]){
        this.crowdsale = new this.web3.eth.Crowdsale(abi);

        let balance = await this.web3.eth.getBalance(account.address);
        console.log("Balance is " + this.web3.utils.fromWei(balance, 'ether') + " ETH");
        let data = this.crowdsale.deploy({
            data : byteCode,
            arguments: args
        }).encodeABI();

        let tx = {
            data : data,
            from  : account.address,
            gas : 5913388
        }
        
        let result = await account.signTransaction(tx);
        let transaction = await this.web3.eth.sendSignedTransaction(result.rawTransaction);
        console.log("Crowdsale Signed");
        //fs.writeFile('Deployed.json', JSON.stringify(transaction), 'utf8', () => {});
        this.address = transaction.crowdsaleAddress;
        return transaction;
    }

    async use(crowdsale_json, address){
        this.json = crowdsale_json;      
        this.abi = crowdsale_json.abi;
        this.address = address ? address : this.address;
        this.crowdsale = new this.web3.eth.Crowdsale(crowdsale_json.abi, this.address)
    } 

    async send(account, byteCode, value='0x0'){
        let tx = {
            data : byteCode,
            from  : account.address,
            to : this.address,
            gasPrice : 20000000000,
            gas : 4000000,
            value: value ? value : '0x0'
        }

        let result = await account.signTransaction(tx);
        let transaction = await window.web3.eth.sendSignedTransaction(result.rawTransaction);
        return transaction;
    }
    
    getCrowdsale(){
        return this.crowdsale;
    }

    getABI(){
        return this.abi;
    }

    getJSON(){
        return this.json;
    }

    getAddress(){
        return this.address;
    }
}


export default crowdsale;