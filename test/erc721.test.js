const { expect } = require("chai");
const ERC721 = artifacts.require("ERC721ContractWideRoyalties");

contract("Token Test", async ([contractOwner, seller1]) => {
  let erc721;

  beforeEach(async () => {
    erc721 = await ERC721.deployed();
  });

  describe("Deployment", () => {
    it("has a name", async () => {
      expect(await erc721.name()).to.equal("ERC721WithRoyalties");
    });

    it("has a symbol", async () => {
      expect(await erc721.symbol()).to.equal("ERC721");
    });

    it("Should set the owner of the contract as contractOwner", async () => {
      expect(await erc721.owner()).to.equal(contractOwner);
    });
  });

  describe("Setting Royalties", () => {
    it("mints the correct amount of tokens to seller", async () => {
      let tokenBalance = await erc721.balanceOf(seller1);
      await erc721.mint(seller1);
      await erc721.mint(seller1);

      newTokenBalance = await erc721.balanceOf(seller1);
      expect((newTokenBalance - tokenBalance).toString()).to.equal("2");
    });

    it("sets the correct tokenId for newly minted tokens", async () => {
      let txn = await erc721.mint(seller1);
      let tokenId = txn.receipt.logs[0].args.tokenId;
      expect(tokenId.toString()).to.equal("2");

      txn = await erc721.mint(seller1);
      tokenId = txn.receipt.logs[0].args.tokenId;
      expect(tokenId.toString()).to.equal("3");

      txn = await erc721.mint(seller1);
      tokenId = txn.receipt.logs[0].args.tokenId;
      expect(tokenId.toString()).to.equal("4");
    });

    it("sets the correct value for default royalties", async () => {
      await erc721.setDefaultRoyalty(contractOwner, 500);
      royalties = await erc721.royaltyInfo(0, 100);
      expect(royalties[0]).to.equal(contractOwner);
      expect(royalties[1].toString()).to.equal("5");
    });

    it("sets the correct value of royalty for specific tokens", async () => {
      let txn = await erc721.mint(seller1);
      let tokenId1 = txn.receipt.logs[0].args.tokenId;

      txn = await erc721.mint(seller1);
      tokenId2 = txn.receipt.logs[0].args.tokenId;

      await erc721.setTokenRoyalty(tokenId1.toString(), contractOwner, 600);
      const royalties0 = await erc721.royaltyInfo(tokenId1.toString(), 100);

      await erc721.setTokenRoyalty(tokenId2.toString(), contractOwner, 1000);
      const royalties1 = await erc721.royaltyInfo(tokenId2.toString(), 100);

      expect(royalties0[1].toString()).to.equal("6");
      expect(royalties1[1].toString()).to.equal("10");
    });
  });

  describe("Editing Royalties", () => {
    let tokenId;
    beforeEach(async () => {
      let txn = await erc721.mint(seller1);
      tokenId = txn.receipt.logs[0].args.tokenId;
    });

    it("Updates token royalties", async () => {
      const newRoyalty = 800;
      let royalties = await erc721.royaltyInfo(tokenId, 100);

      await erc721.setDefaultRoyalty(contractOwner, newRoyalty);
      royalties = await erc721.royaltyInfo(tokenId, 100);
      expect(royalties[1].toString()).to.equal("8");
    });

    it("Removes default royalties", async () => {});
    it("Resets token royalties", async () => {});
  });
});
