const { expect } = require("chai");
const ERC1363 = artifacts.require("ERC1363Mock");
const CrowdsaleToken = artifacts.require("CrowdsaleToken");
const CrowdsaleContract = artifacts.require("CrowdsaleContract");

contract("ERC1363", async ([owner, crowdsaleWaller, spender, recipient]) => {
  let erc1363;
  let crowdsaleToken;
  let crowdsaleContract;

  beforeEach(async () => {
    erc1363 = await ERC1363.deployed("ERC1363Token", "ERC1363", owner, 10000);
    crowdsaleToken = await CrowdsaleToken.deployed(10000);
    crowdsaleContract = await CrowdsaleContract.deployed(
      10,
      crowdsaleWallet,
      crowdsaleToken.address,
      erc1363.address
    );
  });

  it("has a name", async () => {
    expect(await erc1363.name()).to.equal("ERC1363Token");
  });
});
