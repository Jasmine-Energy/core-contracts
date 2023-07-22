import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IJasmineEATExtensions, IJasmineEATExtensionsInterface } from "../../../src/interfaces/IJasmineEATExtensions";
export declare class IJasmineEATExtensions__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "frozen";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IJasmineEATExtensionsInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IJasmineEATExtensions;
}
//# sourceMappingURL=IJasmineEATExtensions__factory.d.ts.map