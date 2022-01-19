const ERC721 = artifacts.require("ERC721ContractWideRoyalties");
const ERC721PerToken = artifacts.require("ERC721PerTokenRoyalties");

module.exports = async function (deployer, network, accounts) {
  await deployer
    .deploy(ERC721, "ERC721WithRoyalties", "ERC721")
    .then((contract) => {
      console.log("ERC721 deployed to: ", contract.address);
    });

  await deployer
    .deploy(ERC721PerToken, "ERC721PerTokenRoyalties", "ERC721v2")
    .then((contract) => {
      console.log("ERC721PerTokenRoyalties deployed to: ", contract.address);
    });
};
