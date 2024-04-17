import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { FormatTypes } from "@ethersproject/abi";
import { assert } from "console";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const deployMinter: DeployFunction = async function ({
  upgrades,
  ethers,
  deployments,
  getNamedAccounts,
  network,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log("deploying Minter on: ", network.name);

  const { owner } = await getNamedAccounts();
  const ownerSigner: SignerWithAddress = await ethers.getSigner(owner);

  // 1. Get constructor args
  const contractName = "JasmineMinter";
  const eatContractName = "JasmineEAT";
  const oracleContractName = "JasmineOracle";
  const minterVersion = "1";
  const bridgeAddress = process.env.LOCAL_JASMINE_BRIDGE;
  const eatDeployment = await deployments.get(eatContractName);
  const oracleDeployment = await deployments.get(oracleContractName);

  // 2. Deploy Contract
  const Minter = await ethers.getContractFactory(contractName, ownerSigner);
  const minterArgs = [
    contractName, 
    minterVersion, 
    bridgeAddress,
    owner
];
  const minter = await upgrades.deployProxy(Minter, minterArgs, {
    unsafeAllow: ["constructor", "state-variable-immutable"],
    constructorArgs: [eatDeployment.address, oracleDeployment.address],
    kind: "uups",
  });
  await minter.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    minter.address
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    `\n\nDeployed Minter proxy to: ${minter.address}, implementation to: ${implementationAddress}`,
    "\n\n"
  );

  // 3. Verify deployment
  const eat = await ethers.getContractAt(
    eatContractName,
    eatDeployment.address
  );
  const eatMinter = await eat.minter();
  assert(
    eatMinter == minter.address,
    "\x1b[31m",
    "EAT's minter does not match deployed address"
  );

  const oracle = await ethers.getContractAt(
    oracleContractName,
    oracleDeployment.address
  );
  const oracleMinter = await oracle.minter();
  assert(
    oracleMinter == minter.address,
    "\x1b[31m",
    "Oracle's minter does not match deployed address"
  );

  assert(
    oracleMinter == eatMinter,
    "\x1b[31m",
    "EAT's minter does not match Oracle's minter"
  );

  // 4. Save deployment
  deployments.save(contractName, {
    abi: <any[]>Minter.interface.format(FormatTypes.full),
    args: minterArgs,
    address: minter.address,
    transactionHash: minter.deployTransaction.hash,
    implementation: implementationAddress,
  });

  // 5. Verify on Etherscan
  try {
    await hre.run("verify:verify", {
      address: minter.address,
      constructorArguments: minterArgs,
    });
  } catch {}
};
deployMinter.tags = ["Minter", "all"];
export default deployMinter;
