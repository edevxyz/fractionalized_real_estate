const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("FractionalRealEstate", function () {
  let FractionalRealEstate, fractionalRealEstate, owner, addr1, addr2

  beforeEach(async () => {
    FractionalRealEstate = await ethers.getContractFactory("FractionalRealEstate");
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

describe("Withdraw function", function () {
    it("Should allow the owner to withdraw the contract balance", async function () {
    await fractionalRealEstate.connect(addr1).mint("QmTestImageHash1", { value: ethers.utils.parseEther("0.1") })
    const initialOwnerBalance = await owner.getBalance()
    const contractBalance = await ethers.provider.getBalance(fractionalRealEstate.address)

    const tx = await fractionalRealEstate.withdraw()
    const receipt = await tx.wait()

    const gasUsed = receipt.gasUsed.mul(tx.gasPrice)
    const finalOwnerBalance = await owner.getBalance()

    expect(finalOwnerBalance).to.equal(initialOwnerBalance.add(contractBalance).sub(gasUsed))
  })
    it("Should revert if a non-owner tries to withdraw", async function () {
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      await expect(fractionalRealEstate.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })    

describe("Set Token Images", function () {
    it("Should set token images when called by the owner and all tokens are minted", async function () {
      for (let i = 1; i <= 1000; i++) {
        await fractionalRealEstate.connect(addr1).mint(`QmHash${i}`, { value: ethers.utils.parseEther("0.1") })
      }
      await fractionalRealEstate.setTokenImages("QmFolderHash")
      for (let i = 1; i <= 1000; i++) {
        expect(await fractionalRealEstate.tokenURI(i)).to.equal("https://ipfs.io/ipfs/QmFolderHash")
      }
    })

it("Should revert if called by a non-owner", async function () {
      await expect(fractionalRealEstate.connect(addr1).setTokenImages("QmFolderHash")).to.be.revertedWith("Ownable: caller is not the owner")
    })

it("Should revert if all tokens are not minted", async function () {
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      await expect(fractionalRealEstate.setTokenImages("QmFolderHash")).to.be.revertedWith("All tokens must be minted before setting images")
    })
  })
})
