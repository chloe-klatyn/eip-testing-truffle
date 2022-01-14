const ERC721 = artifacts.require("ERC721ContractWideRoyalties");

module.exports = async function (deployer, network, accounts) {
  await deployer
    .deploy(ERC721, "ERC721WithRoyalties", "ERC721")
    .then((erc721) => {
      console.log("ERC721 deployed to: ", erc721.address);
    });
};
