const hre = require("hardhat");

async function main() {
    // had to replace this with my actual token address (e.g., a test ERC20)
    const tokenAddress = "0xYourTokenAddressHere";

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(tokenAddress);

    await vault.deployed();

    console.log("Vault deployed to:", vault.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
