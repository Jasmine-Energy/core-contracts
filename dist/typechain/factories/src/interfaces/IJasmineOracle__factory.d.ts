import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IJasmineOracle, IJasmineOracleInterface } from "../../../src/interfaces/IJasmineOracle";
export declare class IJasmineOracle__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "encodedMetadata";
            readonly type: "bytes";
        }];
        readonly name: "updateSeries";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IJasmineOracleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IJasmineOracle;
}
//# sourceMappingURL=IJasmineOracle__factory.d.ts.map