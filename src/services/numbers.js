import moment from 'moment';
import accounting from 'accounting';

Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0]; 

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

class numbers{
    constructor() {
        
    }

    fromDayMonthYear(date){
        let mom = moment().dayOfYear(date.day);
        mom.set("hour", date.hour);
        mom.set("year", date.year);
        return mom.format("ddd, hA"); 
    }
    
    toFloat(number){
        return parseFloat(parseFloat(number).toFixed(2))
    }

    toDate(date){
        let mom = moment().dayOfYear(date.day);
        mom.set("hour", date.hour);
        mom.set("year", date.year);
        return mom.unix();
    }

    toMoney(number){
        return accounting.formatMoney(number, { symbol: "EUR",  format: "%v" }); 
    }

    formatNumber(number){
        return accounting.formatNumber(number);
    }

    toSmartCrowdsaleDecimals(value, decimals){
        let numberWithNoExponents = new Number(value*10**decimals).noExponents();
        return numberWithNoExponents;
    }

    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    fromBigNumberToInteger(value, decimals=18){
        return value/ Math.pow(10, decimals)*1000000000000000000;
    }

    fromExponential(x) {
        if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10,e-1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
        } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
        }
        return x;
    }

}


let Numbers = new numbers();

export default Numbers;