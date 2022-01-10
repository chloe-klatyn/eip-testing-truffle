const { expect } = require("chai");

const ERC777 = artifacts.require("Simple777Token");

contract("Token Test", async ([creator, operator, recipient]) => {
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
    const creatorBalance = await contract.balanceOf(creator);
    expect(totalSupply.toString()).to.equal(creatorBalance.toString());
  });

  it("successfully authorizes and revokes operators", async () => {
    let isOperator = await contract.isOperatorFor(operator, creator);
    expect(isOperator).to.equal(false);
    await contract.authorizeOperator(operator, {
      from: creator,
    });
    isOperator = await contract.isOperatorFor(operator, creator);
    expect(isOperator).to.equal(true);
    contract.revokeOperator(operator, {
      from: creator,
    });
    isOperator = await contract.isOperatorFor(operator, creator);
    expect(isOperator).to.equal(false);
  });

  it("allows operator send", async () => {
    let creatorBalance = await contract.balanceOf(creator);
    const data = web3.utils.sha3("Simple777Data");
    const operatorData = web3.utils.sha3("Simple777OperatorData");

    const amount = web3.utils.toWei(web3.utils.toBN(4000), "ether");
    await contract.operatorSend(
      creator,
      recipient,
      amount,
      data,
      operatorData,
      { from: creator }
    );
    const recipientBalance = await contract.balanceOf(recipient);
    expect(recipientBalance.toString()).to.equal(
      web3.utils.toWei(web3.utils.toBN(4000), "ether").toString()
    );
    creatorBalance = await contract.balanceOf(creator);
    expect(creatorBalance.toString()).to.equal(
      web3.utils.toWei(web3.utils.toBN(6000), "ether").toString()
    );
  });

  it("allows operator burn", async () => {
    let recipientBalance = await contract.balanceOf(recipient);
    await contract.authorizeOperator(creator, { from: recipient });

    const data = web3.utils.sha3("Simple777Data");
    const operatorData = web3.utils.sha3("Simple777OperatorData");
    const burnAmount = web3.utils.toWei(web3.utils.toBN(1000), "ether");
    await contract.operatorBurn(recipient, burnAmount, data, operatorData, {
      from: creator,
    });

    recipientBalance = await contract.balanceOf(recipient);
    expect(recipientBalance.toString()).to.equal(
      web3.utils.toWei(web3.utils.toBN(3000), "ether").toString()
    );
  });
});
