import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getContractAddress } from "@ethersproject/address";
import { FormatTypes } from "@ethersproject/abi";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const deployEAT: DeployFunction = async function (
  { upgrades, ethers, deployments, getNamedAccounts, network, ...hre }: HardhatRuntimeEnvironment
) {
  console.log("deploying EAT on: ", network.name);

  const { owner } = await getNamedAccounts();
  const ownerSigner: SignerWithAddress = await ethers.getSigner(owner);

  // 1. Get constructor args
  const contractName = "JasmineEAT";
  const tokenURI = process.env.EAT_URI ?? (network.live ? "https://api.jasmine.energy/v1/eat/{id}.json" : "https://api.jazzmine.xyz/v1/eat/{id}.json");
  const ownerNonce = await ownerSigner.getTransactionCount();
  const pendingTxs = 5;
  const futureMinterAddress = getContractAddress({
    from: owner,
    nonce: ownerNonce + pendingTxs,
  });

  // 2. Deploy Contract
  const EAT = await ethers.getContractFactory(contractName);
  const eatArgs = [
    tokenURI,            // initialURI
    futureMinterAddress, // initialMinter
    owner,               // initialOwner
  ];
  const eat = await upgrades.deployProxy(EAT, eatArgs, {
    kind: "uups",
  });
  await eat.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    eat.address
  );
  console.log(
    "\x1b[36m%s\x1b[0m",
    `\n\nDeployed EAT proxy to: ${eat.address}, implementation to: ${implementationAddress}`,
    "\n\n"
  );

  // 3. Save deployment
  deployments.save(contractName, {
    abi: <any[]>EAT.interface.format(FormatTypes.full),
    address: eat.address,
    args: eatArgs,
    transactionHash: eat.deployTransaction.hash,
    implementation: implementationAddress,
  });

  // 4. Verify on Etherscan
  try {
    await hre.run("verify:verify", {
      address: eat.address,
      constructorArguments: eatArgs,
    });
  } catch {}
};
deployEAT.tags = ["EAT", "all"];
export default deployEAT;
