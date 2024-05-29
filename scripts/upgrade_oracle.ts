import { ethers, deployments, run, getNamedAccounts, network } from "hardhat";

async function main() {
    const { owner } = await getNamedAccounts();
    const ownerSigner = await ethers.getSigner(owner);

    const deployedContractName = "JasmineOracleV1";
    const contractName = "JasmineOracleV2";
    const proxyAddress = await deployments.getOrNull(deployedContractName);

    if (!proxyAddress) {
        console.log(`No proxy found for ${deployedContractName}`);
        return;
    }

    const implDeploy = await deployments.deploy(contractName, {
        from: owner,
        log: true,
    });
    const implementationAddress = implDeploy.address;

    const Oracle = await ethers.getContractAt(deployedContractName, proxyAddress.address, ownerSigner);

    console.log(`Upgrading ${deployedContractName} to ${contractName} at ${implementationAddress}`);

    const tx = await Oracle.upgradeTo(implementationAddress);
    const result = await tx.wait();
    console.log(`Upgraded ${deployedContractName} to ${contractName} at ${implementationAddress} with tx ${result.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
