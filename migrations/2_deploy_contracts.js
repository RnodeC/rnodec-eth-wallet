var ProportionalDistributor = artifacts.require("ProportionalDistributor");

module.exports = function(deployer) {
  deployer.deploy(ProportionalDistributor);
};

