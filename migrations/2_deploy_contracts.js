const Intruder = artifacts.require("./Intruder.sol");

module.exports = function (deployer) {
  deployer.deploy(Intruder,1000000);
};
