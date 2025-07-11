const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;



describe("YieldBank Vault", function () {
    let owner, user;
    let vault, mockToken;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        // Deploy mock token with 1M supply
        const MockToken = await ethers.getContractFactory("MockToken");
        mockToken = await MockToken.deploy(ethers.utils.parseEther("1000000"));
        await mockToken.deployed();

        // Deploy Vault with token address
        const Vault = await ethers.getContractFactory("Vault");
        vault = await Vault.deploy(mockToken.address);
        await vault.deployed();

        // Send tokens to user
        await mockToken.transfer(user.address, ethers.utils.parseEther("1000"));

        // User approves Vault
        await mockToken.connect(user).approve(vault.address, ethers.utils.parseEther("1000"));
    });

    it("should allow deposit and update balance", async function () {
        await vault.connect(user).deposit(ethers.utils.parseEther("500"));
        const balance = await vault.balances(user.address);
        expect(balance).to.equal(ethers.utils.parseEther("500"));
    });

    it("should allow withdrawal of funds", async function () {
        await vault.connect(user).deposit(ethers.utils.parseEther("300"));
        await vault.connect(user).withdraw(ethers.utils.parseEther("200"));

        const remaining = await vault.balances(user.address);
        expect(remaining).to.equal(ethers.utils.parseEther("100"));
    });

    it("should not allow withdrawing more than deposited", async function () {
        await vault.connect(user).deposit(ethers.utils.parseEther("100"));
        await expect(
            vault.connect(user).withdraw(ethers.utils.parseEther("200"))
        ).to.be.revertedWith("Insufficient balance");
    });

    it("should not allow deposits when paused", async function () {
        await vault.connect(owner).pause();
        await expect(
            vault.connect(user).deposit(ethers.utils.parseEther("100"))
        ).to.be.revertedWith("Pausable: paused");
    });
});
