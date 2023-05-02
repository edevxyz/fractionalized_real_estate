const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("FractionalRealEstate", function () {
  let FractionalRealEstate, fractionalRealEstate, owner, addr1, addr2

  beforeEach(async () => {
    FractionalRealEstate = await ethers.getContractFactory("FractionalRealEstate")
    [owner, addr1, addr2] = await ethers.getSigners()
    fractionalRealEstate = await FractionalRealEstate.deploy()
  })
