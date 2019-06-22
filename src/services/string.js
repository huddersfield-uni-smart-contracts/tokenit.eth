
class StringWorker{
 
    constructor(){}

    toAddressConcat = (string) => `${string.substring(0, 6)}...${string.substring(string.length - 2)}`

    titleCase = (str) =>  {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
    }

    toNumber = (num) =>  {
         return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          
    }
}



let StringWorkerSingleton = new StringWorker();

export default StringWorkerSingleton;