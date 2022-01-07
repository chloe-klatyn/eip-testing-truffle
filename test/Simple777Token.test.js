const { expect } = require("chai");

const ERC777 = artifacts.require("Simple777Token");

// has a name
// has a symbol
// assigns the initial total supply to the creator
// allows operator burn

contract("Token Test", async (accounts) => {
  let contract;
  beforeEach(async () => {
    contract = await ERC777.deployed();
  });

  it("has a name", async () => {
    const name = await contract.name();
    expect(name).to.equal("Simple777Token");
  });

  it("has a symbol", async () => {
    const symbol = await contract.symbol();
    expect(symbol).to.equal("S7");
  });
});
