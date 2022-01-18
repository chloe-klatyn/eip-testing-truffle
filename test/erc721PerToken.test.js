const { expect } = require("chai");
const ERC721 = artifacts.require("ERC721PerTokenRoyalties");

contract("Token Test", async ([contractOwner, seller1]) => {
  let erc721;

  beforeEach(async () => {
    erc721 = await ERC721.deployed();
  });

  describe("Deployment", () => {
    it("has a name", async () => {
      expect(await erc721.name()).to.equal("ERC721PerTokenRoyalties");
    });

    it("has a symbol", async () => {
      expect(await erc721.symbol()).to.equal("ERC721v2");
    });

    it("Should set the owner of the contract as contractOwner", async () => {
      expect(await erc721.owner()).to.equal(contractOwner);
    });
  });
});
