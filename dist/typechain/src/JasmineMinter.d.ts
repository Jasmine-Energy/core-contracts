import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface JasmineMinterInterface extends utils.Interface {
    functions: {
        "CONSUMENONCE_TYPEHASH()": FunctionFragment;
        "DOMAIN_SEPARATOR()": FunctionFragment;
        "MINTBATCH_TYPEHASH()": FunctionFragment;
        "MINT_TYPEHASH()": FunctionFragment;
        "acceptOwnership()": FunctionFragment;
        "bridge()": FunctionFragment;
        "burn(uint256,uint256,bytes)": FunctionFragment;
        "burnBatch(uint256[],uint256[],bytes)": FunctionFragment;
        "consumeNonce(bytes32,bytes)": FunctionFragment;
        "consumedNonces(bytes32)": FunctionFragment;
        "initialize(string,string,address,address)": FunctionFragment;
        "mint(address,uint256,uint256,bytes,bytes,uint256,bytes32,bytes)": FunctionFragment;
        "mintBatch(address,uint256[],uint256[],bytes,bytes[],uint256,bytes32,bytes)": FunctionFragment;
        "name()": FunctionFragment;
        "oracle()": FunctionFragment;
        "owner()": FunctionFragment;
        "pendingOwner()": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setBridge(address)": FunctionFragment;
        "token()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
        "version()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "CONSUMENONCE_TYPEHASH" | "DOMAIN_SEPARATOR" | "MINTBATCH_TYPEHASH" | "MINT_TYPEHASH" | "acceptOwnership" | "bridge" | "burn" | "burnBatch" | "consumeNonce" | "consumedNonces" | "initialize" | "mint" | "mintBatch" | "name" | "oracle" | "owner" | "pendingOwner" | "proxiableUUID" | "renounceOwnership" | "setBridge" | "token" | "transferOwnership" | "upgradeTo" | "upgradeToAndCall" | "version"): FunctionFragment;
    encodeFunctionData(functionFragment: "CONSUMENONCE_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "DOMAIN_SEPARATOR", values?: undefined): string;
    encodeFunctionData(functionFragment: "MINTBATCH_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "MINT_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "acceptOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "bridge", values?: undefined): string;
    encodeFunctionData(functionFragment: "burn", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "burnBatch", values: [
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "consumeNonce", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "consumedNonces", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "mint", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "mintBatch", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>[],
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "name", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingOwner", values?: undefined): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setBridge", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "token", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "version", values?: undefined): string;
    decodeFunctionResult(functionFragment: "CONSUMENONCE_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DOMAIN_SEPARATOR", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MINTBATCH_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "MINT_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "bridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "burnBatch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "consumeNonce", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "consumedNonces", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintBatch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "BridgeChanged(address)": EventFragment;
        "BurnedBatch(address,uint256[],uint256[],bytes)": EventFragment;
        "BurnedSingle(address,uint256,uint256,bytes)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "NonceConsumed(bytes32)": EventFragment;
        "OwnershipTransferStarted(address,address)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BridgeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BurnedBatch"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BurnedSingle"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NonceConsumed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferStarted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}
export interface AdminChangedEventObject {
    previousAdmin: string;
    newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<[
    string,
    string
], AdminChangedEventObject>;
export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;
export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[
    string
], BeaconUpgradedEventObject>;
export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;
export interface BridgeChangedEventObject {
    newBridge: string;
}
export type BridgeChangedEvent = TypedEvent<[string], BridgeChangedEventObject>;
export type BridgeChangedEventFilter = TypedEventFilter<BridgeChangedEvent>;
export interface BurnedBatchEventObject {
    owner: string;
    ids: BigNumber[];
    amounts: BigNumber[];
    metadata: string;
}
export type BurnedBatchEvent = TypedEvent<[
    string,
    BigNumber[],
    BigNumber[],
    string
], BurnedBatchEventObject>;
export type BurnedBatchEventFilter = TypedEventFilter<BurnedBatchEvent>;
export interface BurnedSingleEventObject {
    owner: string;
    id: BigNumber;
    amount: BigNumber;
    metadata: string;
}
export type BurnedSingleEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber,
    string
], BurnedSingleEventObject>;
export type BurnedSingleEventFilter = TypedEventFilter<BurnedSingleEvent>;
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface NonceConsumedEventObject {
    nonce: string;
}
export type NonceConsumedEvent = TypedEvent<[string], NonceConsumedEventObject>;
export type NonceConsumedEventFilter = TypedEventFilter<NonceConsumedEvent>;
export interface OwnershipTransferStartedEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferStartedEvent = TypedEvent<[
    string,
    string
], OwnershipTransferStartedEventObject>;
export type OwnershipTransferStartedEventFilter = TypedEventFilter<OwnershipTransferStartedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface JasmineMinter extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: JasmineMinterInterface;
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
        CONSUMENONCE_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;
        DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<[string]>;
        MINTBATCH_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;
        MINT_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;
        acceptOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        bridge(overrides?: CallOverrides): Promise<[string]>;
        burn(id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        burnBatch(ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        consumeNonce(nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        consumedNonces(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        initialize(initialName: PromiseOrValue<string>, initialVersion: PromiseOrValue<string>, initialBridge: PromiseOrValue<string>, initialOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mint(receiver: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, transferData: PromiseOrValue<BytesLike>, oracleData: PromiseOrValue<BytesLike>, deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mintBatch(receiver: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], transferData: PromiseOrValue<BytesLike>, oracleDatas: PromiseOrValue<BytesLike>[], deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        name(overrides?: CallOverrides): Promise<[string]>;
        oracle(overrides?: CallOverrides): Promise<[string]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        pendingOwner(overrides?: CallOverrides): Promise<[string]>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setBridge(newBridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        token(overrides?: CallOverrides): Promise<[string]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        version(overrides?: CallOverrides): Promise<[string]>;
    };
    CONSUMENONCE_TYPEHASH(overrides?: CallOverrides): Promise<string>;
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;
    MINTBATCH_TYPEHASH(overrides?: CallOverrides): Promise<string>;
    MINT_TYPEHASH(overrides?: CallOverrides): Promise<string>;
    acceptOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    bridge(overrides?: CallOverrides): Promise<string>;
    burn(id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    burnBatch(ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    consumeNonce(nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    consumedNonces(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    initialize(initialName: PromiseOrValue<string>, initialVersion: PromiseOrValue<string>, initialBridge: PromiseOrValue<string>, initialOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mint(receiver: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, transferData: PromiseOrValue<BytesLike>, oracleData: PromiseOrValue<BytesLike>, deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mintBatch(receiver: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], transferData: PromiseOrValue<BytesLike>, oracleDatas: PromiseOrValue<BytesLike>[], deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    name(overrides?: CallOverrides): Promise<string>;
    oracle(overrides?: CallOverrides): Promise<string>;
    owner(overrides?: CallOverrides): Promise<string>;
    pendingOwner(overrides?: CallOverrides): Promise<string>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setBridge(newBridge: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    token(overrides?: CallOverrides): Promise<string>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    version(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        CONSUMENONCE_TYPEHASH(overrides?: CallOverrides): Promise<string>;
        DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;
        MINTBATCH_TYPEHASH(overrides?: CallOverrides): Promise<string>;
        MINT_TYPEHASH(overrides?: CallOverrides): Promise<string>;
        acceptOwnership(overrides?: CallOverrides): Promise<void>;
        bridge(overrides?: CallOverrides): Promise<string>;
        burn(id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, metadata: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        burnBatch(ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], metadata: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        consumeNonce(nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        consumedNonces(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        initialize(initialName: PromiseOrValue<string>, initialVersion: PromiseOrValue<string>, initialBridge: PromiseOrValue<string>, initialOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        mint(receiver: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, transferData: PromiseOrValue<BytesLike>, oracleData: PromiseOrValue<BytesLike>, deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        mintBatch(receiver: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], transferData: PromiseOrValue<BytesLike>, oracleDatas: PromiseOrValue<BytesLike>[], deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        name(overrides?: CallOverrides): Promise<string>;
        oracle(overrides?: CallOverrides): Promise<string>;
        owner(overrides?: CallOverrides): Promise<string>;
        pendingOwner(overrides?: CallOverrides): Promise<string>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setBridge(newBridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        token(overrides?: CallOverrides): Promise<string>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        version(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "BridgeChanged(address)"(newBridge?: PromiseOrValue<string> | null): BridgeChangedEventFilter;
        BridgeChanged(newBridge?: PromiseOrValue<string> | null): BridgeChangedEventFilter;
        "BurnedBatch(address,uint256[],uint256[],bytes)"(owner?: PromiseOrValue<string> | null, ids?: null, amounts?: null, metadata?: null): BurnedBatchEventFilter;
        BurnedBatch(owner?: PromiseOrValue<string> | null, ids?: null, amounts?: null, metadata?: null): BurnedBatchEventFilter;
        "BurnedSingle(address,uint256,uint256,bytes)"(owner?: PromiseOrValue<string> | null, id?: null, amount?: null, metadata?: null): BurnedSingleEventFilter;
        BurnedSingle(owner?: PromiseOrValue<string> | null, id?: null, amount?: null, metadata?: null): BurnedSingleEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "NonceConsumed(bytes32)"(nonce?: PromiseOrValue<BytesLike> | null): NonceConsumedEventFilter;
        NonceConsumed(nonce?: PromiseOrValue<BytesLike> | null): NonceConsumedEventFilter;
        "OwnershipTransferStarted(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferStartedEventFilter;
        OwnershipTransferStarted(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferStartedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        CONSUMENONCE_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;
        DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<BigNumber>;
        MINTBATCH_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;
        MINT_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;
        acceptOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        bridge(overrides?: CallOverrides): Promise<BigNumber>;
        burn(id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        burnBatch(ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        consumeNonce(nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        consumedNonces(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        initialize(initialName: PromiseOrValue<string>, initialVersion: PromiseOrValue<string>, initialBridge: PromiseOrValue<string>, initialOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mint(receiver: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, transferData: PromiseOrValue<BytesLike>, oracleData: PromiseOrValue<BytesLike>, deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mintBatch(receiver: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], transferData: PromiseOrValue<BytesLike>, oracleDatas: PromiseOrValue<BytesLike>[], deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        oracle(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setBridge(newBridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        token(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        version(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        CONSUMENONCE_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        MINTBATCH_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        MINT_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        acceptOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        bridge(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        burn(id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        burnBatch(ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], metadata: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        consumeNonce(nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        consumedNonces(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(initialName: PromiseOrValue<string>, initialVersion: PromiseOrValue<string>, initialBridge: PromiseOrValue<string>, initialOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mint(receiver: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, transferData: PromiseOrValue<BytesLike>, oracleData: PromiseOrValue<BytesLike>, deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mintBatch(receiver: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], transferData: PromiseOrValue<BytesLike>, oracleDatas: PromiseOrValue<BytesLike>[], deadline: PromiseOrValue<BigNumberish>, nonce: PromiseOrValue<BytesLike>, sig: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setBridge(newBridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        version(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
//# sourceMappingURL=JasmineMinter.d.ts.map