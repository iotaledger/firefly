import { AbiType, StateMutabilityType } from '../enums'
import { Abi } from '../types'

export const ISC_SANDBOX_ABI: Abi = [
    {
        inputs: [
            { internalType: 'address', name: 'target', type: 'address' },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'allow',
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [
            { internalType: 'ISCHname', name: 'contractHname', type: 'uint32' },
            { internalType: 'ISCHname', name: 'entryPoint', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: 'params',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'call',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [
            { internalType: 'ISCHname', name: 'contractHname', type: 'uint32' },
            { internalType: 'ISCHname', name: 'entryPoint', type: 'uint32' },
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: 'params',
                type: 'tuple',
            },
        ],
        name: 'callView',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'bytes', name: 'key', type: 'bytes' },
                            { internalType: 'bytes', name: 'value', type: 'bytes' },
                        ],
                        internalType: 'struct ISCDictItem[]',
                        name: 'items',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct ISCDict',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        name: 'erc20NativeTokensAddress',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'erc20NativeTokensFoundrySerialNumber',
        outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'NFTID', name: 'collectionID', type: 'bytes32' }],
        name: 'erc721NFTCollectionAddress',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
        ],
        name: 'getAllowance',
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
        name: 'getAllowanceFrom',
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
        name: 'getAllowanceTo',
        outputs: [
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getBaseTokenProperties',
        outputs: [
            {
                components: [
                    { internalType: 'string', name: 'name', type: 'string' },
                    { internalType: 'string', name: 'tickerSymbol', type: 'string' },
                    { internalType: 'uint8', name: 'decimals', type: 'uint8' },
                    { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
                ],
                internalType: 'struct ISCTokenProperties',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getChainID',
        outputs: [{ internalType: 'ISCChainID', name: '', type: 'bytes32' }],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getChainOwnerID',
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getEntropy',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'NFTID', name: 'id', type: 'bytes32' }],
        name: 'getIRC27NFTData',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: 'NFTID', name: 'ID', type: 'bytes32' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct L1Address',
                                name: 'issuer',
                                type: 'tuple',
                            },
                            { internalType: 'bytes', name: 'metadata', type: 'bytes' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct ISCAgentID',
                                name: 'owner',
                                type: 'tuple',
                            },
                        ],
                        internalType: 'struct ISCNFT',
                        name: 'nft',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { internalType: 'string', name: 'standard', type: 'string' },
                            { internalType: 'string', name: 'version', type: 'string' },
                            { internalType: 'string', name: 'mimeType', type: 'string' },
                            { internalType: 'string', name: 'uri', type: 'string' },
                            { internalType: 'string', name: 'name', type: 'string' },
                        ],
                        internalType: 'struct IRC27NFTMetadata',
                        name: 'metadata',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct IRC27NFT',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'NFTID', name: 'id', type: 'bytes32' }],
        name: 'getNFTData',
        outputs: [
            {
                components: [
                    { internalType: 'NFTID', name: 'ID', type: 'bytes32' },
                    {
                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                        internalType: 'struct L1Address',
                        name: 'issuer',
                        type: 'tuple',
                    },
                    { internalType: 'bytes', name: 'metadata', type: 'bytes' },
                    {
                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                        internalType: 'struct ISCAgentID',
                        name: 'owner',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct ISCNFT',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        name: 'getNativeTokenID',
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct NativeTokenID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'uint32', name: 'foundrySN', type: 'uint32' }],
        name: 'getNativeTokenScheme',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'mintedTokens', type: 'uint256' },
                    { internalType: 'uint256', name: 'meltedTokens', type: 'uint256' },
                    { internalType: 'uint256', name: 'maximumSupply', type: 'uint256' },
                ],
                internalType: 'struct NativeTokenScheme',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getRequestID',
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCRequestID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getSenderAccount',
        outputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct ISCAgentID',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [],
        name: 'getTimestampUnixSeconds',
        outputs: [{ internalType: 'int64', name: '', type: 'int64' }],
        stateMutability: StateMutabilityType.View,
        type: AbiType.Function,
    },
    {
        inputs: [
            {
                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                internalType: 'struct L1Address',
                name: 'targetAddress',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'assets',
                type: 'tuple',
            },
            { internalType: 'bool', name: 'adjustMinimumStorageDeposit', type: 'bool' },
            {
                components: [
                    { internalType: 'ISCHname', name: 'targetContract', type: 'uint32' },
                    { internalType: 'ISCHname', name: 'entrypoint', type: 'uint32' },
                    {
                        components: [
                            {
                                components: [
                                    { internalType: 'bytes', name: 'key', type: 'bytes' },
                                    { internalType: 'bytes', name: 'value', type: 'bytes' },
                                ],
                                internalType: 'struct ISCDictItem[]',
                                name: 'items',
                                type: 'tuple[]',
                            },
                        ],
                        internalType: 'struct ISCDict',
                        name: 'params',
                        type: 'tuple',
                    },
                    {
                        components: [
                            { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                            {
                                components: [
                                    {
                                        components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                        internalType: 'struct NativeTokenID',
                                        name: 'ID',
                                        type: 'tuple',
                                    },
                                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                                ],
                                internalType: 'struct NativeToken[]',
                                name: 'nativeTokens',
                                type: 'tuple[]',
                            },
                            { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                        ],
                        internalType: 'struct ISCAssets',
                        name: 'allowance',
                        type: 'tuple',
                    },
                    { internalType: 'uint64', name: 'gasBudget', type: 'uint64' },
                ],
                internalType: 'struct ISCSendMetadata',
                name: 'metadata',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'int64', name: 'timelock', type: 'int64' },
                    {
                        components: [
                            { internalType: 'int64', name: 'time', type: 'int64' },
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct L1Address',
                                name: 'returnAddress',
                                type: 'tuple',
                            },
                        ],
                        internalType: 'struct ISCExpiration',
                        name: 'expiration',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct ISCSendOptions',
                name: 'sendOptions',
                type: 'tuple',
            },
        ],
        name: 'send',
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [
            { internalType: 'address', name: 'addr', type: 'address' },
            {
                components: [
                    { internalType: 'uint64', name: 'baseTokens', type: 'uint64' },
                    {
                        components: [
                            {
                                components: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
                                internalType: 'struct NativeTokenID',
                                name: 'ID',
                                type: 'tuple',
                            },
                            { internalType: 'uint256', name: 'amount', type: 'uint256' },
                        ],
                        internalType: 'struct NativeToken[]',
                        name: 'nativeTokens',
                        type: 'tuple[]',
                    },
                    { internalType: 'NFTID[]', name: 'nfts', type: 'bytes32[]' },
                ],
                internalType: 'struct ISCAssets',
                name: 'allowance',
                type: 'tuple',
            },
        ],
        name: 'takeAllowedFunds',
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
    {
        inputs: [{ internalType: 'string', name: 's', type: 'string' }],
        name: 'triggerEvent',
        outputs: [],
        stateMutability: StateMutabilityType.NonPayable,
        type: AbiType.Function,
    },
]
