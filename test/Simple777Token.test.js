const { expect } = require("chai");

const ERC777 = artifacts.require("Simple777Token");

// has a name
// has a symbol
// assigns the initial total supply to the creator
// allows operator burn

contract("Token Test", async ([_, registryFunder, creator, operator]) => {
  let contract;
  beforeEach(async () => {
    contract = await ERC777.deployed();
  });

  it("has a name", async () => {
    expect(await contract.name()).to.equal("Simple777Token");
  });

  it("has a symbol", async () => {
    expect(await contract.symbol()).to.equal("S7");
  });

  it("assigns the initial total supply to the creator", async () => {
    const totalSupply = await contract.totalSupply();
    const creator = await contract.creator();
    const creatorBalance = await contract.balanceOf(creator);
    expect(totalSupply.toString()).to.equal(creatorBalance.toString());
  });
});
