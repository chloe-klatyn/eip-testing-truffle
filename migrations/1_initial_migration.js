const ERC1363 = artifacts.require("ERC1363Mock");
const CrowdsaleToken = artifacts.require("CrowdsaleToken");
const CrowdsaleContract = artifacts.require("CrowdsaleContract");

module.exports = async function (deployer, network, accounts) {
  let erc1363Address;
  let crowdsaleTokenAddress;

  console.log("accounts: ", accounts);
  deployer
    .deploy(ERC1363, "ERC1363Token", "ERC1363", accounts[0], 10000)
    .then((erc1363) => {
      erc1363Address = erc1363.address;
      console.log("erc1363 address: ", erc1363Address);
    });

  deployer.deploy(CrowdsaleToken, 10000).then((crwd) => {
    crowdsaleTokenAddress = crwd.address;
    console.log("crwd address: ", crowdsaleTokenAddress);
  });

  // deployer
  //   .deploy(
  //     CrowdsaleContract,
  //     10,
  //     accounts[0],
  //     crowdsaleTokenAddress,
  //     erc1363Address
  //   )
  //   .then((crowdsaleContract) => {
  //     console.log("crowdsaleContract: ", crowdsaleContract.address);
  //   });
};
