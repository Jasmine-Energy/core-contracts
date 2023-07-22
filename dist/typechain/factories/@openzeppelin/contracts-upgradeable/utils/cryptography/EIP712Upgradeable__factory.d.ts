import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { EIP712Upgradeable, EIP712UpgradeableInterface } from "../../../../../@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable";
export declare class EIP712Upgradeable__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }];
    static createInterface(): EIP712UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): EIP712Upgradeable;
}
//# sourceMappingURL=EIP712Upgradeable__factory.d.ts.map