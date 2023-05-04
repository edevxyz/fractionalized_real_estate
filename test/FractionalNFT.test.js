const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("FractionalRealEstate", function () {
  let FractionalRealEstate, fractionalRealEstate, owner, addr1, addr2

  beforeEach(async () => {
    FractionalRealEstate = await ethers.getContractFactory("FractionalRealEstate")
    [owner, addr1, addr2] = await ethers.getSigners()
    fractionalRealEstate = await FractionalRealEstate.deploy()
  })

describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fractionalRealEstate.owner()).to.equal(owner.address)
    })

it("Should initialize with the correct token name and symbol", async function () {
      expect(await fractionalRealEstate.name()).to.equal("FractionalRealEstate")
      expect(await fractionalRealEstate.symbol()).to.equal("FRE")
    })
  })

 describe("Minting", function () {
    it("Should mint a token successfully and store the IPFS hash", async function () {
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      expect(await fractionalRealEstate.totalSupply()).to.equal(1)
      expect(await fractionalRealEstate.tokenURI(1)).to.equal("https://ipfs.io/ipfs/QmHash1")
    })

it("Should revert if minting with incorrect price", async function () {
      await expect(fractionalRealEstate.connect(addr1).mint("QmHash2", { value: ethers.utils.parseEther("0.05") })).to.be.revertedWith("Incorrect price")
    })

    it("Should revert if maximum supply is reached", async function () {
      for (let i = 1; i <= 1000; i++) {
        await fractionalRealEstate.connect(addr1).mint(`QmHash${i}`, { value: ethers.utils.parseEther("0.1") })
      }
      await expect(fractionalRealEstate.connect(addr1).mint("QmHash1001", { value: ethers.utils.parseEther("0.1") })).to.be.revertedWith("Maximum supply reached")
    })
  })

it("Should revert if called by a non-owner", async function () {
      await expect(fractionalRealEstate.connect(addr1).setTokenImages("QmFolderHash")).to.be.revertedWith("Ownable: caller is not the owner")
    })
