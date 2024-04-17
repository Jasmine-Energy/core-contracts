# Jasmine Contracts

[![test](https://github.com/Jasmine-Energy/jasmine-contracts/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/Jasmine-Energy/jasmine-contracts/actions/workflows/test.yml)
[![GitBook - Documentation](https://img.shields.io/badge/GitBook-Documentation-orange?logo=gitbook&logoColor=white)](https://docs.jasmine.energy/)
[![Chat](https://img.shields.io/discord/1012757430779789403)](https://discord.gg/bcGUebezJb)
[![License: BUSL 1.1](https://img.shields.io/badge/License-BUSL%201.1-blue.svg)](./LICENSE)
[![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)
[![hardhat](https://hardhat.org/buidler-plugin-badge.svg)](https://hardhat.org)

## Meta

### Polygon Deployment

**Deployer:** [`0xe3a305455c71944ec7c5b85b845c617fa6f6ccd7`](https://polygonscan.com/address/0xe3a305455c71944ec7c5b85b845c617fa6f6ccd7)
| Contract      | Proxy address                              | Implementation address                     |
|---------------|--------------------------------------------|--------------------------------------------|
| JasmineEAT    | [`0xba3aa8083f8978257aaafb19ed698a623197a7c1`](https://polygonscan.com/address/0xba3aa8083f8978257aaafb19ed698a623197a7c1#readProxyContract) | [`0x900e684776265f2159ffec56e6161a8a48687549`](https://polygonscan.com/address/0x900e684776265f2159ffec56e6161a8a48687549#code) |
| JasmineOracle | [`0x954f12ab1e40fbd7c28f2ab5285d3c74ba6faf6f`](https://polygonscan.com/address/0x954f12ab1e40fbd7c28f2ab5285d3c74ba6faf6f#readProxyContract) | [`0xe19cd2ce2b3b082fd9b879ccf508672455a24c66`](https://polygonscan.com/address/0xe19cd2ce2b3b082fd9b879ccf508672455a24c66#code) |
| JasmineMinter | [`0x5e71fa178f3b8ca0fc4736b8a85a1b669c042dde`](https://polygonscan.com/address/0x5e71fa178f3b8ca0fc4736b8a85a1b669c042dde#readProxyContract) | [`0xe58160776da8b66bb42e7926438e67f5f590f438`](https://polygonscan.com/address/0xe58160776da8b66bb42e7926438e67f5f590f438#code) |

### Amoy Deployment

**Deployer:** [`0x0B98574958b84F1E2F8FF48cCb07A3c8d4211804`](https://amoy.polygonscan.com/address/0x0B98574958b84F1E2F8FF48cCb07A3c8d4211804)
| Contract      | Proxy address                              | Implementation address                     |
|---------------|--------------------------------------------|--------------------------------------------|
| JasmineEAT    | [`0x4586AAa40f251E79bEf567FC74d4Cb55bb39D5EA`](https://amoy.polygonscan.com/address/0x4586AAa40f251E79bEf567FC74d4Cb55bb39D5EA#readProxyContract) | [`0xd3E1bc0397fA5800278090dF074e2EF12CB71301`](https://amoy.polygonscan.com/address/0xd3E1bc0397fA5800278090dF074e2EF12CB71301#code) |
| JasmineOracle | [`0x402d7E62Eccc433B2f02f4F51dc8ACA3A2Bc76c7`](https://amoy.polygonscan.com/address/0x402d7E62Eccc433B2f02f4F51dc8ACA3A2Bc76c7#readProxyContract) | [`0x08B6BbEff9c895A533fE85bC0Beb0F4874021210`](https://amoy.polygonscan.com/address/0x08B6BbEff9c895A533fE85bC0Beb0F4874021210#code) |
| JasmineMinter | [`0x9E0CEccF495bf9d4fdB5e85417029c6fF7669c85`](https://amoy.polygonscan.com/address/0x9E0CEccF495bf9d4fdB5e85417029c6fF7669c85#readProxyContract) | [`0x1313f299Fc4fed5280e907d1b6f5ACd7c2128C04`](https://amoy.polygonscan.com/address/0x1313f299Fc4fed5280e907d1b6f5ACd7c2128C04#code) |

## Overview

The Jasmine smart contract protocol consists of 3 upgradeable contracts:

* [`JasmineEAT`](./src/JasmineEAT.sol)
* [`JasmineMinter`](./src/JasmineMinter.sol)
* [`JasmineOracle`](./src/JasmineOracle.sol)

Each of these contracts is deployed behind an [ERC1967 UUPS
proxy](./src/ERC1967UUPSProxy.sol). The owner of each proxy contract has
complete control of the contract. For security, the ownership of the contract is
separated from the minting right. Transferring the ownership of the proxy (which
also includes the right to set the addresses of the other entities in the
protocol) is a 2-step process. First, the existing owner must call
`transferOwnership` specifying the address of the new owner. Then the new owner
must call `acceptOwnership`. This is to prevent typos leaving the contract
without a valid owner.

### `JasmineEAT`

`JasmineEAT` is a simple owner-upgradeable ERC1155 multitoken with
owner-designated centralized minting rights. In this case, the `minter`
attribute is intended to be set to the address of the proxy for
`JasmineMinter`. In addition to the centralized minting functionality,
`JasmineEAT` also has the common, but not standardized burnable extension. This
burn functionality is used by `JasmineMinter` for both redemption and bridge-off
functionality.

`JasmineEAT` does not support ERC1888, but it is a strong consideration for a
future upgrade.

#### Invalidation

Invalidation of an EAT is performed in a few cases:

* there was an error in transferring the attributes of the underlying EAC to the
  EAT
* the underlying EAC is junk
* the registry removed the underlying EAC from Jasmine's bridge account

Invalidation of EATs occurs in 2 stages. First the entire EAT series must be
frozen. A frozen EAT series still exists on chain, but it cannot be minted,
transferred, redeemed, or bridged-off. Note that this freezing applies to the
series, not to the holder(s) of the EATs. Once an EAT series is frozen, the
tokens can then be slashed to destroy them on-chain. Notably, once a EAT series
is frozen, the token holder can still voluntarily burn the EAT.

Rigorously, first the owner of the `JasmineEAT` contract (not the minter, not
the holder of the EAT), calls `freeze`. If the issue that prompted the freezing
of the tokens is resolved, the owner of `JasmineEAT` can call `thaw` to restore
the series to its normal functionality. While an EAT series is frozen, the owner
of `JasmineEAT` can call `slash`/`slashBatch` to destroy the
EATs. `slash`/`slashBatch` must be called for each account that holds the
affected EATs. Calling `thaw` after `slash`/`slashBatch` does not restore the
destroyed tokens, but does restore any un-destroyed tokens to their original
functionality.

### `JasmineMinter`

`JasmineMinter` contains all the logic for bridge-on, redemption, and
bridge-off.

#### Bridge-on

Bridge-on is achieved using an EIP712 typed, structured data signature. The
owner-designated `bridge` attribute is the ECDSA signer (wallet/EOA) that signs
these messages. The EIP712 signature specifies the address that will perform the
mint (which is not necessarily the address that will receive the EAT), the `id`
of the EAT series, the number/amount of EATs to mint, the deadline timestamp by
which the EATs must be minted on-chain, and an optional encoded message to the
oracle to register that EAT series metadata. The logic that controls the
`bridge` EOA must decide whether to omit the oracle message at the time it signs
the minting right. The decision is simple: if the series has already had at
least 1 token minted into it, omit the oracle message. There is also a nonce
used to prevent replay attacks. The nonce should be randomly generated using a
source of high-quality entropy.

A user in possession of a validly-signed, unexpired minting right then calls the
appropriate minting function on the `JasmineMinter` contract (either `mint` or
`mintBatch`). The `receiver` address is unconstrained and is the address that
will receive the tokens. If `receiver` is a contract, it must implement the
`IERC1155Receiver` interface. If it does not, the transaction will revert and
can be safely retried (with the same signature), as long as the deadline hasn't
been reached, substituting a different `receiver`. If `receiver` is a contract,
the `transferData` argument can be used by the caller to pass a message to the
`receiver`'s `onERC1155Received` or `onERC1155BatchReceived` hook. The arguments
`id`/`ids`, `amount`/`amounts`, `oracleData`, `deadline`, and `nonce` are
constrained to match the EIP712 signature provided in `sig`.

`JasmineMinter` does not support ERC1271 smart contract signatures, but it is a
strong consideration for a future upgrade.

##### Mistakes in bridge-on

In the event of an off-chain error (human or otherwise) in the bridge-on
process, the infrastructure controlling the bridge must take care to avoid
double-spending the mistaken tokens. The function `consumeNonce` is provided for
this purpose. Here's how to use it:

1. The bridge infrastructure signs a `ConsumeNonce` message to `JasmineMinter`
   with the _exact same_ nonce as was signed for the
   `MintAuthorization`/`MintBatchAuthorization` message

2. Jasmine or the mistaken user submits a call to the `consumeNonce` function,
   carrying the same nonce

3. The bridge infrastructure waits for the `NonceConsumed` message to be emitted
   by `JasmineMinter` with the specified nonce

4. The bridge infrastrucutre checks that the transaction that emitted
   `NonceConsumed` message emitted **NO OTHER EVENTS**

5. The bridge infrastructure waits for the transaction to become finalized. This
   can be somewhat complex to compute in a high-assurance setting, but Circle
   (USDC's issuer) considers Polygon final after 372 blocks as of the time this
   document was written.

6. The bridge infrastructure re-issues a new, corrected signature with a new,
   randomly-generated nonce

This procedure does not block the bridge-on, bridge-off, or redemption of
unrelated tokens. It is only the affected token series that is blocked until the
nonce is invalidated and finalized. Additionally, if the criterion in step 4 is
not satisfied or if the mistaken token has already been minted on-chain, the
only recourse is to follow the [freeze-then-slash procedure](#invalidation).

#### Bridge-off

Bridge-off is achieved using the `burn` and `burnBatch` functions *on the
minter*. The user desiring to bridge-off their EATs must first approve the
`JasmineMinter` proxy contract to spend their ERC1155 `JasmineEAT` tokens
through the `setApprovalForAll` function on the `JasmineEAT` contract. Then, in
a separate transaction, they must call `burn`/`burnBatch` *on the minter*
specifying the EATs that they wish to bridge-off. The extra argument `metadata`
to those 2 function is an unstructured data field that the off-chain bridge
infrastructure listens for. The off-chain bridge infrastructure interprets the
`metadata` emitted as part of the `BurnedSingle`/`BurnedBatch` event as an
instruction on where the released EAC should be transferred. The structure of
this message is defined by the off-chain infrastructure and is not interpreted
by any on-chain logic. Note that there is no requirement that the payload
emitted by the event conform to the specified format. Sanitization and overflow
checking must be strictly observed.

As in the case of mistakes in the bridge-on process, the off-chain bridge
infrastructure must wait for on-chain finality before taking any action based on
the `BurnedSingle`/`BurnedBatch` event.

#### Redemption

Redemption uses exactly the same flow as bridge-off, except that the `metadata`
contains a machine readable instruction to the off-chain bridge infrastructure
to redeem the EAC instead of transferring it to another entity. The structure
and distinguishing of the redemption message from the bridge-off message is not
interpreted by any on-chain logic. The same precautionary notes apply.

### `JasmineOracle`

`JasmineOracle` provides machine-readable metadata about each EAT series to
other contracts. It provides a way to query the following attributes of an EAT
series:

* UUID
* Registry
* Vintage (as a UNIX timestamp)
* Fuel type
* Certificate type
* Endorsement

The optional message from the bridge signer to the oracle has the following
fields, all of which are unsigned integers of the specified length:

| position | name             | bit length | comment              |
| :------- | :--------------- | :--------- | :------------------- |
| 0        | version          | 8          | always 1             |
| 1        | uuid             | 128        | see below            |
| 2        | registry         | 32         | see below            |
| 3        | vintage          | 40         | timestamp; see below |
| 4        | fuel             | 32         |                      |
| 5        | certificate type | 32         |                      |
| 6        | endorsement      | 32         |                      |

The message from the bridge to the oracle is simply the ABI encoding of those
fields in the specified order.

Additionally, the `id` of a token series is formed as the concatenation of the
following bit fields (big endian):

| bit range | name     | comment  |
| :-------- | :------- | :------- |
| 0-127     | uuid     |          |
| 128-159   | registry |          |
| 160-199   | vintage  |          |
| 200-255   | padding  | always 0 |

These values are checked on-chain against the corresponding fields of the ABI
encoded message.

---

Please see the `JasmineOracle` contract itself to see how to query those
attributes on-chain. Please note that new attributes may be added by contract
upgrades.

## Licensing

The primary license for Jasmine Bridge Contract is the Business Source License 1.1 (`BUSL-1.1`), see [`LICENSE`](./LICENSE).
