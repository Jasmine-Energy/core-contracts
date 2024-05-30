import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getContractAddress } from "@ethersproject/address";
import { FormatTypes } from "@ethersproject/abi";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const deployOracle: DeployFunction = async function ({
  upgrades,
  ethers,
  deployments,
  getNamedAccounts,
  network,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log("deploying Oracle on: ", network.name);

  const { owner } = await getNamedAccounts();
  const ownerSigner: SignerWithAddress = await ethers.getSigner(owner);
  let pendingTxs: number = 3;

  // 1. Get constructor args
  const contractName = "JasmineOracleV1";
  const ownerNonce = await ownerSigner.getTransactionCount();

  const futureMinterAddress = getContractAddress({
    from: owner,
    nonce: ownerNonce + pendingTxs,
  });

  // 2. Deploy Contract
  const Oracle = await ethers.getContractFactory(contractName);
  const oracleArgs = [
    futureMinterAddress, // initialMinter
    owner,               // initialOwner
  ];
  const oracle = await upgrades.deployProxy(Oracle, oracleArgs, {
    kind: "uups",
  });
  await oracle.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    oracle.address
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    `\n\nDeployed Oracle proxy to: ${oracle.address}, implementation to: ${implementationAddress}`,
    "\n\n"
  );

  // 3. Save deployment
  deployments.save(contractName, {
    abi: <any[]>Oracle.interface.format(FormatTypes.full),
    address: oracle.address,
    args: oracleArgs,
    transactionHash: oracle.deployTransaction.hash,
    implementation: implementationAddress,
  });

  // 4. Verify on Etherscan
  try {
    await hre.run("verify:verify", {
      address: oracle.address,
      constructorArguments: oracleArgs,
    });
  } catch {}
};
deployOracle.tags = ["Oracle", "all"];
export default deployOracle;
