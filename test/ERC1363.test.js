const { expect } = require('chai')
const ERC1363 = artifacts.require('ERC1363Mock')
const CrowdsaleToken = artifacts.require('CrowdsaleToken')
const CrowdsaleContract = artifacts.require('CrowdsaleContract')

contract('ERC1363', async ([owner, crowdsaleWallet, spender, recipient]) => {
  let erc1363
  let crowdsaleToken
  let crowdsaleContract

  beforeEach(async () => {
    erc1363 = await ERC1363.deployed('ERC1363Token', 'ERC1363', owner, 10000)
    crowdsaleToken = await CrowdsaleToken.deployed(10000)
    crowdsaleContract = await CrowdsaleContract.deployed(10, crowdsaleWallet, crowdsaleToken.address, erc1363.address)
  })

  //   describe('CrowdsaleToken Deployment', () => {
  //     it('has a name', async () => {
  //       expect(await crowdsaleToken.name()).to.equal('CrowdsaleToken')
  //     })

  //     it('has a symbol', async () => {
  //       expect(await crowdsaleToken.symbol()).to.equal('CRWD')
  //     })

  //     it('sets the owner of the contract', async () => {
  //       expect(await crowdsaleToken.owner()).to.equal(owner)
  //     })

  //     it('mints initial supply of ERC20 tokens to contract deployer', async () => {
  //       expect((await crowdsaleToken.balanceOf(owner)).toString()).to.equal('10000')
  //     })
  //   })

  //   describe('ERC1363 Deployment', () => {
  //     it('has a name', async () => {
  //       expect(await erc1363.name()).to.equal('ERC1363Token')
  //     })

  //     it('has a symbol', async () => {
  //       expect(await erc1363.symbol()).to.equal('ERC1363')
  //     })

  //     it('sets the owner of the contract', async () => {
  //       expect(await erc1363.owner()).to.equal(owner)
  //     })

  //     it('mints initial supply of ERC1363 tokens to contract deployer', async () => {
  //       expect((await crowdsaleToken.balanceOf(owner)).toString()).to.equal('10000')
  //     })
  //   })

  //   describe('Crowdsale Contract Deployment', () => {
  //     it('sets the owner of the contract', async () => {
  //       expect(await erc1363.owner()).to.equal(owner)
  //     })

  //     it('sets the token to be distributed as the crowdsale token', async () => {
  //       expect(await crowdsaleContract.token()).to.equal(crowdsaleToken.address)
  //     })

  //     it('sets the accepted token as the ERC1363 token', async () => {
  //       expect(await crowdsaleContract.acceptedToken()).to.equal(erc1363.address)
  //     })

  //     it('sets the distribution rate to the value declared in the constructor', async () => {
  //       expect((await crowdsaleContract.rate()).toString()).to.equal('10')
  //     })
  //   })

  describe('receiving payment using transferAndCall', () => {
    beforeEach(async function () {
      await erc1363.approve(spender, 100, { from: owner })
      //   const caller = await erc1363.checkCaller({ from: spender })
      //   console.log('caller: ', caller.receipt.logs[0].args.caller)
      const spenderAllowance = await erc1363.allowance(owner, spender)
      //   console.log('spender allowance: ', spenderAllowance.toString())
    })

    it('should accept payments', async () => {
      try {
        // console.log('owner balance: ', (await erc1363.balanceOf(owner)).toString())
        await erc1363.transfer(spender, 1000)
        // console.log('spender balance: ', (await erc1363.balanceOf(spender)).toString())
        await erc1363.transferFrom(owner, recipient, 50, { from: spender })
        // console.log('spender balance: ', (await erc1363.balanceOf(spender)).toString())

        // await erc1363.transferFromAndCall(spender, crowdsaleContract.address, 10)
      } catch (err) {
        console.log(err)
      }
    })

    //     it("should log purchase event", async () => {});
    //     it("should assign tokens to sender", async () => {});
    //     it("should increase token raised", async () => {});
    //     it("should forward funds to wallet", async () => {});
    //     it("reverts on zero-valued payments", async () => {});
    //     it("reverts using a not accepted ERC1363", async () => {});
  })
})
