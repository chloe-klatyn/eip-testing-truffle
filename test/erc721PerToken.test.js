const { expect } = require('chai')
const ERC721 = artifacts.require('ERC721PerTokenRoyalties')

contract('Token Test', async ([contractOwner, royaltyReceiver, seller1, seller2]) => {
  let erc721

  beforeEach(async () => {
    erc721 = await ERC721.deployed()
  })

  describe('Deployment', () => {
    it('has a name', async () => {
      expect(await erc721.name()).to.equal('ERC721PerTokenRoyalties')
    })

    it('has a symbol', async () => {
      expect(await erc721.symbol()).to.equal('ERC721v2')
    })

    it('sets the owner of the contract as contractOwner', async () => {
      expect(await erc721.owner()).to.equal(contractOwner)
    })
  })

  describe('Setting Royalties', () => {
    it('sets royalty for token upon minting', async () => {
      const royaltyAmount = 700
      const salePrice = 100
      let txn = await erc721.mint(seller1, royaltyReceiver, royaltyAmount)
      let tokenId = txn.receipt.logs[0].args.tokenId
      let royalty = await erc721.royaltyInfo(tokenId, salePrice)
      const expectedRoyalty = (royaltyAmount * salePrice) / 10000
      expect(royalty.royaltyAmount.toString()).to.equal(expectedRoyalty.toString())
    })

    it('sets royalty for tokens upon batch minting', async () => {
      const royaltyAmount1 = 600
      const royaltyAmount2 = 700
      const salePrice = 100

      txn = await erc721.mintBatch(
        [seller1, seller2],
        [royaltyReceiver, royaltyReceiver],
        [royaltyAmount1, royaltyAmount2]
      )
      firstTokenId = txn.receipt.logs[0].args.tokenId.toString()
      secondTokenId = parseInt(firstTokenId) + 1

      const firstTokenRoyalty = await erc721.royaltyInfo(firstTokenId, salePrice)
      const expectedRoyalty1 = (royaltyAmount1 * salePrice) / 10000
      expect(firstTokenRoyalty.royaltyAmount.toString()).to.equal(expectedRoyalty1.toString())

      const secondTokenRoyalty = await erc721.royaltyInfo(secondTokenId, salePrice)
      const expectedRoyalty2 = (royaltyAmount2 * salePrice) / 10000
      expect(secondTokenRoyalty.royaltyAmount.toString()).to.equal(expectedRoyalty2.toString())
    })
  })
})
