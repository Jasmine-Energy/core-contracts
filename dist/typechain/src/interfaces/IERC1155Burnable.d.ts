import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface IERC1155BurnableInterface extends utils.Interface {
    functions: {
        "burn(address,uint256,uint256)": FunctionFragment;
        "burnBatch(address,uint256[],uint256[])": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "burn" | "burnBatch"): FunctionFragment;
    encodeFunctionData(functionFragment: "burn", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "burnBatch", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[]
    ]): string;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burnBatch", data: BytesLike): Result;
    events: {};
}
export interface IERC1155Burnable extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IERC1155BurnableInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        burn(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        burnBatch(account: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], values: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    burn(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    burnBatch(account: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], values: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        burn(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        burnBatch(account: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], values: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        burn(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        burnBatch(account: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], values: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        burn(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        burnBatch(account: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], values: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=IERC1155Burnable.d.ts.map