
let Web3 = require('web3')
let ouputLog = require('./utils/log')
let config = require('./config')
let inputAddress = require('./inputAddress')

for(let i in config) {
  if(!config[i]) {
    console.log('missing' + ' ' + i + 'Please configure')
    return
  }
}
var web3 = new Web3(config.rpc);

let abi = require('./abi/erc20.json')
let contractaddress = config.contractaddress

let transferFrom = async (address,i,time) => {
  let gasprice = await web3.eth.getGasPrice()
  let contractInstance = new web3.eth.Contract(abi, contractaddress)
 
  let txCount = await web3.eth.getTransactionCount(config.fromAddress)
 
  const txObject = {
    nonce: web3.utils.toHex(txCount + Number(i)),
    gasLimit: web3.utils.toHex(210000), 
    gasPrice: web3.utils.toHex(gasprice),
    to: contractaddress,
    chainId: 97,
    data: contractInstance.methods.transfer( address,web3.utils.toWei(`${String(Number(i) + 1)}`, 'ether')).encodeABI()
  }
  
  let txn = await web3.eth.accounts.signTransaction(txObject, config.rivateKey)

  web3.eth.sendSignedTransaction(txn.rawTransaction).on('transactionHash', function(hash){
    ouputLog(`地址:${address}; 数量:${String(Number(i) + 1)}; 交易hash:${hash}` + '\r\n',time)
}).on('receipt', function(receipt){
    console.log("链上结果返回，返回数据：",receipt)
}).on('confirmation', function(confirmationNumber, receipt){
    console.log("链上confirmation结果返回，确认数：",confirmationNumber)
    console.log("链上confirmation结果返回，返回数据：",receipt)
}).on('error', console.error);
 
};

// 模拟取地址列表 数量100
var addressList = []
if(config.isRealFromAddress) {
  addressList = inputAddress
}else{
  var addressObj = {
    address: '0xFff33d9777BB27Cc5D74922394BFB51f5C8Fe846'
  }
  addressList = new Array(100).fill(addressObj)
}


var myDate = new Date((new Date).getTime() + 8*60*60*1000);
var time = `[${myDate.toJSON().split('T').join(' ').substring(0,19)}]`

const logHead = `
  from:${config.fromAddress}
  contractaddress:${contractaddress}
`
ouputLog(logHead,time)
for(let i in addressList) {
  addressList[i].address && transferFrom(addressList[i].address,i,time)
}