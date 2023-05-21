const { expect } = require("chai")
const { ethers } = require("hardhat")

// Test suite for the FractionalRealEstate contract
describe("FractionalRealEstate", function () {
  let FractionalRealEstate, fractionalRealEstate, owner, addr1, addr2

  // Set up the contract instance and signers before each test
  beforeEach(async () => {
    FractionalRealEstate = await ethers.getContractFactory("FractionalRealEstate");
    [owner, addr1, addr2] = await ethers.getSigners()
    fractionalRealEstate = await FractionalRealEstate.deploy()
  })

  // Test suite for deployment-related functionality
  describe("Deployment", function () {
    // Test if the contract is deployed with the correct owner
    it("Should set the right owner", async function () {
      expect(await fractionalRealEstate.owner()).to.equal(owner.address)
    })

    // Check if the contract is deployed with the correct token name and symbol
    it("Should initialize with the correct token name and symbol", async function () {
      expect(await fractionalRealEstate.name()).to.equal("FractionalRealEstate")
      expect(await fractionalRealEstate.symbol()).to.equal("FRE")
    })
  })

  // Test suite for minting-related functionality
  describe("Minting", function () {
    // Test if a token is minted successfully and the IPFS hash is stored
    it("Should mint a token successfully and store the IPFS hash", async function () {
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      expect(await fractionalRealEstate.totalSupply()).to.equal(1)
      expect(await fractionalRealEstate.tokenURI(1)).to.equal("https://ipfs.io/ipfs/QmHash1")
    })

    // Test if minting reverts when the price is incorrect
    it("Should revert if minting with incorrect price", async function () {
      await expect(fractionalRealEstate.connect(addr1).mint("QmHash2", { value: ethers.utils.parseEther("0.05") })).to.be.revertedWith("Incorrect price")
    })

    // Test if minting reverts when the maximum supply is reached
    it("Should revert if maximum supply is reached", async function () {
      for (let i = 1; i <= 1000; i++) {
        await fractionalRealEstate.connect(addr1).mint(`QmHash${i}`, { value: ethers.utils.parseEther("0.1") })
      }
      await expect(fractionalRealEstate.connect(addr1).mint("QmHash1001", { value: ethers.utils.parseEther("0.1") })).to.be.revertedWith("Maximum supply reached")
    })
  })

  // Test suite for the withdraw function
  describe("Withdraw function", function () {
    // Test if the owner can withdraw the contract balance
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

    // Test if a non-owner is prevented from withdrawing
    it("Should revert if a non-owner tries to withdraw", async function () {
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      await expect(fractionalRealEstate.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  // Test suite for setting token images
  describe("Set Token Images", function () {
    // Test if the owner can set token images when not all tokens are minted
    it("Should set token images when called by the owner (not only when everything has been minted)", async function () {
      for (let i = 1; i <= 1000; i++) {
        await fractionalRealEstate.connect(addr1).mint(`QmHash${i}`, { value: ethers.utils.parseEther("0.1") })
      }
      await fractionalRealEstate.setTokenImages("QmFolderHash")
      for (let i = 1; i <= 1000; i++) {
        expect(await fractionalRealEstate.tokenURI(i)).to.equal("https://ipfs.io/ipfs/QmFolderHash")
      }
    })

    // Test if a non-owner is prevented from setting token images
    it("Should revert if called by a non-owner", async function () {
      await expect(fractionalRealEstate.connect(addr1).setTokenImages("QmFolderHash")).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  // Test suite for payRent function
  describe("payRent", function() {
    // Test if rent is distributed correctly among token holders
    it("Should distribute rent correctly among token holders", async function () {
      // Mint tokens for addr1 and addr2
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      await fractionalRealEstate.connect(addr2).mint("QmHash2", { value: ethers.utils.parseEther("0.1") })

      // Check initial balances
      const initialBalance1 = await addr1.getBalance()
      const initialBalance2 = await addr2.getBalance()

      // Pay rent
      const rentAmount = ethers.utils.parseEther("1")
      await fractionalRealEstate.connect(owner).payRent({ value: rentAmount })

      // Check final balances
      const finalBalance1 = await addr1.getBalance()
      const finalBalance2 = await addr2.getBalance()

      // Verify that the rent was distributed correctly
      expect(finalBalance1).to.equal(initialBalance1.add(rentAmount.div(2)))
      expect(finalBalance2).to.equal(initialBalance2.add(rentAmount.div(2)))
    })

    // Test if rent payment is not allowed when no tokens have been minted
    it("Should not allow rent payment when no tokens have been minted", async function () {
      const rentAmount = ethers.utils.parseEther("1")
      await expect(fractionalRealEstate.connect(owner).payRent({ value: rentAmount })).to.be.revertedWith("No tokens have been minted yet")
    })

    // Test if excess  rent payment is distributed proportionally among token holders
    it("Should distribute excess rent payment proportionally among token holders", async function () {
      // Mint tokens for addr1 and addr2
      await fractionalRealEstate.connect(addr1).mint("QmHash1", { value: ethers.utils.parseEther("0.1") })
      await fractionalRealEstate.connect(addr2).mint("QmHash2", { value: ethers.utils.parseEther("0.1") })

      // Check initial balances
      const initialBalance1 = await addr1.getBalance()
      const initialBalance2 = await addr2.getBalance()

      // Pay excess rent
      const excessRentAmount = ethers.utils.parseEther("1.5")
      await fractionalRealEstate.connect(owner).payRent({ value: excessRentAmount })

      // Check final balances
      const finalBalance1 = await addr1.getBalance()
      const finalBalance2 = await addr2.getBalance()

      // Calculate expected rent per token
      const expectedRentPerToken = excessRentAmount.div(2)

      // Verify that the excess rent was distributed correctly
      expect(finalBalance1).to.equal(initialBalance1.add(expectedRentPerToken))
      expect(finalBalance2).to.equal(initialBalance2.add(expectedRentPerToken))
    })
  })
})
