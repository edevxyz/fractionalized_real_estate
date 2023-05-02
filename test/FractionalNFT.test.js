const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("FractionalRealEstate", function () {
  let FractionalRealEstate, fractionalRealEstate, owner, addr1, addr2

  beforeEach(async () => {
  //  FractionalRealEstate = await ethers.getContractFactory("FractionalRealEstate")
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
