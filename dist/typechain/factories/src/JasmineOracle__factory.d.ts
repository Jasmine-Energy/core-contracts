import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { JasmineOracle, JasmineOracleInterface } from "../../src/JasmineOracle";
type JasmineOracleConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class JasmineOracle__factory extends ContractFactory {
    constructor(...args: JasmineOracleConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<JasmineOracle>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): JasmineOracle;
    connect(signer: Signer): JasmineOracle__factory;
    static readonly bytecode = "0x60a06040523060805234801561001457600080fd5b506080516116a561005a60003960008181610679015281816106b9015281816108180152818161085801528181610972015281816109b20152610a4501526116a56000f3fe6080604052600436106101095760003560e01c8063715018a611610095578063d7c9d1c511610064578063d7c9d1c514610313578063e30c397814610333578063f2fde38b14610351578063f776e98d14610371578063fca3b5aa146103ab57600080fd5b8063715018a61461028957806379ba50971461029e5780638da5cb5b146102b3578063bc5f8ccd146102d157600080fd5b80634ce78e5f116100dc5780634ce78e5f146101ad5780634f1ef286146101fb57806352d1902d1461020e57806354e69d0e1461023157806369cffd171461025157600080fd5b8063075461721461010e57806307e3810c1461014b5780633659cfe61461016d578063485cc9551461018d575b600080fd5b34801561011a57600080fd5b5060fb5461012e906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561015757600080fd5b5061016b6101663660046112f7565b6103cb565b005b34801561017957600080fd5b5061016b61018836600461135a565b61066f565b34801561019957600080fd5b5061016b6101a8366004611375565b61074e565b3480156101b957600080fd5b506101eb6101c83660046113a8565b600091825260fc60205260409091205465010000000000900463ffffffff161490565b6040519015158152602001610142565b61016b6102093660046113ca565b610968565b34801561021a57600080fd5b50610223610a38565b604051908152602001610142565b34801561023d57600080fd5b506101eb61024c366004611402565b610aeb565b34801561025d57600080fd5b5061027161026c36600461142e565b610b16565b6040516001600160801b039091168152602001610142565b34801561029557600080fd5b5061016b610b2c565b3480156102aa57600080fd5b5061016b610b40565b3480156102bf57600080fd5b506033546001600160a01b031661012e565b3480156102dd57600080fd5b506101eb6102ec3660046113a8565b600091825260fc6020526040909120546901000000000000000000900463ffffffff161490565b34801561031f57600080fd5b506101eb61032e3660046113a8565b610bb7565b34801561033f57600080fd5b506065546001600160a01b031661012e565b34801561035d57600080fd5b5061016b61036c36600461135a565b610bcf565b34801561037d57600080fd5b506101eb61038c3660046113a8565b600091825260fc602052604090912054610100900463ffffffff161490565b3480156103b757600080fd5b5061016b6103c636600461135a565b610c40565b6103d3610c92565b60008060006103e185610cfc565b92509250925060008060008060008060008a806020019051810190610406919061145b565b96509650965096509650965096508660ff1660011461047c5760405162461bcd60e51b815260206004820152602760248201527f4a61736d696e654f7261636c653a20696e76616c6964206d65746164617461206044820152663b32b939b4b7b760c91b60648201526084015b60405180910390fd5b856001600160801b03168a146104d45760405162461bcd60e51b815260206004820152601c60248201527f4a61736d696e654f7261636c653a2055554944206d69736d61746368000000006044820152606401610473565b8463ffffffff1689146105295760405162461bcd60e51b815260206004820181905260248201527f4a61736d696e654f7261636c653a207265676973747279206d69736d617463686044820152606401610473565b8364ffffffffff16881461057f5760405162461bcd60e51b815260206004820152601f60248201527f4a61736d696e654f7261636c653a2076696e74616765206d69736d61746368006044820152606401610473565b60405180608001604052808860ff1681526020018463ffffffff1681526020018363ffffffff1681526020018263ffffffff1681525060fc60008e815260200190815260200160002060008201518160000160006101000a81548160ff021916908360ff16021790555060208201518160000160016101000a81548163ffffffff021916908363ffffffff16021790555060408201518160000160056101000a81548163ffffffff021916908363ffffffff16021790555060608201518160000160096101000a81548163ffffffff021916908363ffffffff160217905550905050505050505050505050505050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036106b75760405162461bcd60e51b815260040161047390611504565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610700600080516020611629833981519152546001600160a01b031690565b6001600160a01b0316146107265760405162461bcd60e51b815260040161047390611550565b61072f81610d78565b6040805160008082526020820190925261074b91839190610d80565b50565b600054610100900460ff161580801561076e5750600054600160ff909116105b806107885750303b158015610788575060005460ff166001145b6107eb5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610473565b6000805460ff19166001179055801561080e576000805461ff0019166101001790555b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036108565760405162461bcd60e51b815260040161047390611504565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661089f600080516020611629833981519152546001600160a01b031690565b6001600160a01b0316146108c55760405162461bcd60e51b815260040161047390611550565b6108ce82610eeb565b6108d6610f04565b60fb80546001600160a01b0319166001600160a01b0385169081179091556040517fb6b8f1859c5c352e5ffad07d0f77e384ac725512c015bd3a3ffc885831c8a42590600090a28015610963576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036109b05760405162461bcd60e51b815260040161047390611504565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166109f9600080516020611629833981519152546001600160a01b031690565b6001600160a01b031614610a1f5760405162461bcd60e51b815260040161047390611550565b610a2882610d78565b610a3482826001610d80565b5050565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610ad85760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610473565b5060008051602061162983398151915290565b600080610af785610cfc565b92505050838110158015610b0b5750828111155b9150505b9392505050565b600080610b2283610cfc565b5090949350505050565b610b34610f6f565b610b3e6000610eeb565b565b60655433906001600160a01b03168114610bae5760405162461bcd60e51b815260206004820152602960248201527f4f776e61626c6532537465703a2063616c6c6572206973206e6f7420746865206044820152683732bb9037bbb732b960b91b6064820152608401610473565b61074b81610eeb565b600080610bc384610cfc565b50909314949350505050565b610bd7610f6f565b606580546001600160a01b0383166001600160a01b03199091168117909155610c086033546001600160a01b031690565b6001600160a01b03167f38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e2270060405160405180910390a350565b610c48610f6f565b60fb80546001600160a01b0319166001600160a01b0383169081179091556040517fb6b8f1859c5c352e5ffad07d0f77e384ac725512c015bd3a3ffc885831c8a42590600090a250565b60fb546001600160a01b03163314610b3e5760405162461bcd60e51b815260206004820152602760248201527f4a61736d696e654f7261636c653a2063616c6c6572206973206e6f74207468656044820152661036b4b73a32b960c91b6064820152608401610473565b608081901c606082901c63ffffffff16603883901c64ffffffffff1666ffffffffffffff84168015610d705760405162461bcd60e51b815260206004820152601960248201527f4a61736d696e654f7261636c653a20696e76616c6964204944000000000000006044820152606401610473565b509193909250565b61074b610f6f565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610db35761096383610fc9565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610e0d575060408051601f3d908101601f19168201909252610e0a9181019061159c565b60015b610e705760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610473565b6000805160206116298339815191528114610edf5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610473565b50610963838383611065565b606580546001600160a01b031916905561074b81611090565b600054610100900460ff16610b3e5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610473565b6033546001600160a01b03163314610b3e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610473565b6001600160a01b0381163b6110365760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610473565b60008051602061162983398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b61106e836110e2565b60008251118061107b5750805b156109635761108a8383611122565b50505050565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6110eb81610fc9565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606001600160a01b0383163b61118a5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610473565b600080846001600160a01b0316846040516111a591906115d9565b600060405180830381855af49150503d80600081146111e0576040519150601f19603f3d011682016040523d82523d6000602084013e6111e5565b606091505b509150915061120d828260405180606001604052806027815260200161164960279139611216565b95945050505050565b60608315611225575081610b0f565b610b0f838381511561123a5781518083602001fd5b8060405162461bcd60e51b815260040161047391906115f5565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261127b57600080fd5b813567ffffffffffffffff8082111561129657611296611254565b604051601f8301601f19908116603f011681019082821181831017156112be576112be611254565b816040528381528660208588010111156112d757600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806040838503121561130a57600080fd5b82359150602083013567ffffffffffffffff81111561132857600080fd5b6113348582860161126a565b9150509250929050565b80356001600160a01b038116811461135557600080fd5b919050565b60006020828403121561136c57600080fd5b610b0f8261133e565b6000806040838503121561138857600080fd5b6113918361133e565b915061139f6020840161133e565b90509250929050565b600080604083850312156113bb57600080fd5b50508035926020909101359150565b600080604083850312156113dd57600080fd5b6113e68361133e565b9150602083013567ffffffffffffffff81111561132857600080fd5b60008060006060848603121561141757600080fd5b505081359360208301359350604090920135919050565b60006020828403121561144057600080fd5b5035919050565b805163ffffffff8116811461135557600080fd5b600080600080600080600060e0888a03121561147657600080fd5b875160ff8116811461148757600080fd5b60208901519097506001600160801b03811681146114a457600080fd5b95506114b260408901611447565b9450606088015164ffffffffff811681146114cc57600080fd5b93506114da60808901611447565b92506114e860a08901611447565b91506114f660c08901611447565b905092959891949750929550565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6000602082840312156115ae57600080fd5b5051919050565b60005b838110156115d05781810151838201526020016115b8565b50506000910152565b600082516115eb8184602087016115b5565b9190910192915050565b60208152600082518060208401526116148160408501602087016115b5565b601f01601f1916919091016040019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220e96992223db6e1eab0ea011dd6842fc42969a1574922416ecb3bc14e5da8e41e64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "previousAdmin";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "newAdmin";
            readonly type: "address";
        }];
        readonly name: "AdminChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "beacon";
            readonly type: "address";
        }];
        readonly name: "BeaconUpgraded";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newMinter";
            readonly type: "address";
        }];
        readonly name: "MinterChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferStarted";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "acceptOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }];
        readonly name: "getUUID";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "";
            readonly type: "uint128";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "query";
            readonly type: "uint256";
        }];
        readonly name: "hasCertificateType";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "query";
            readonly type: "uint256";
        }];
        readonly name: "hasEndorsement";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "query";
            readonly type: "uint256";
        }];
        readonly name: "hasFuel";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "query";
            readonly type: "uint256";
        }];
        readonly name: "hasRegistry";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "id";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "min";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "max";
            readonly type: "uint256";
        }];
        readonly name: "hasVintage";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "initialMinter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "initialOwner";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "minter";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "proxiableUUID";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newMinter";
            readonly type: "address";
        }];
        readonly name: "setMinter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }];
        readonly name: "upgradeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "upgradeToAndCall";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }];
    static createInterface(): JasmineOracleInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): JasmineOracle;
}
export {};
//# sourceMappingURL=JasmineOracle__factory.d.ts.map