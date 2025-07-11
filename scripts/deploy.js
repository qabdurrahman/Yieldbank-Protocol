const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    // Deploy MockToken
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy(ethers.utils.parseEther("1000000")); // 1M tokens
    await mockToken.deployed();
    console.log("MockToken deployed to:", mockToken.address);

    // Deploy Vault with MockToken address
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(mockToken.address);
    await vault.deployed();
    console.log("Vault deployed to:", vault.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// const hre = require("hardhat");

// async function main() {
//     // had to replace this with my actual token address (e.g., a test ERC20)
//     const tokenAddress = "0xYourTokenAddressHere";

//     const Vault = await hre.ethers.getContractFactory("Vault");
//     const vault = await Vault.deploy(tokenAddress);

//     await vault.deployed();

//     console.log("Vault deployed to:", vault.address);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });