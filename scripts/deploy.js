const hre = require("hardhat");

async function main() {
  const FractionalRealEstate = await hre.ethers.getContractFactory("FractionalRealEstate");
  const fractionalRealEstate = await FractionalRealEstate.deploy();
  await fractionalRealEstate.deployed();

  console.log("FractionalRealEstate deployed to:", fractionalRealEstate.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});