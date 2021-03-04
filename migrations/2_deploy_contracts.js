var Intruder = artifacts.require("./Intruder.sol");
var IntruderSale = artifacts.require("./IntruderSale.sol");

module.exports = function (deployer) {
  deployer.deploy(Intruder,1000000).then(function(){
  	//Token price is 0.01 Ether
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(IntruderSale,Intruder.address, tokenPrice);
  });
};
