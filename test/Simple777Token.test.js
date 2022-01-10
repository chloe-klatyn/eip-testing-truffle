const { expect } = require("chai");

const ERC777 = artifacts.require("Simple777Token");

contract("Token Test", async ([_, registryFunder, creator, operator]) => {
  let contract;
  let msgSender;
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
    msgSender = await contract.creator();
    const creatorBalance = await contract.balanceOf(msgSender);
    expect(totalSupply.toString()).to.equal(creatorBalance.toString());
  });

  it("successfully assigns addresses as operators", async () => {
    let isOperator = await contract.isOperatorFor(operator, creator);
    expect(isOperator).to.equal(false);
    contract.authorizeOperator(operator, {
      from: creator,
    });
    isOperator = await contract.isOperatorFor(operator, creator);
    expect(isOperator).to.equal(true);
  });

  // it("successfully revokes operators", async () => {
  //   const revoke = await contract.revokeOperator(creator);
  //   const allOperators = await contract.defaultOperators();
  // });

  // it("allows operator burn", async () => {
  //   const creatorBalance = await contract.balanceOf(msgSender);
  //   const data = web3.utils.sha3("Simple777Data");
  //   const operatorData = web3.utils.sha3("Simple777OperatorData");
  // });

  // it("allows operator send", async () => {
  //   const creatorBalance = await contract.balanceOf(creator);
  //   const data = web3.utils.sha3("Simple777Data");
  //   const operatorData = web3.utils.sha3("Simple777OperatorData");
  // });
});
