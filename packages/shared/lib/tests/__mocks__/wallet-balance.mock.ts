import { Balance } from '@iota/sdk/out/types'

export const MOCK_WALLET_BALANCE: Balance = {
    baseCoin: {
        total: BigInt('10000'),
        available: BigInt('9000'),
        votingPower: '0',
    },
    foundries: [],
    nativeTokens: [],
    nfts: [],
    potentiallyLockedOutputs: {},
    accounts: [],
    delegations: [],
    requiredStorageDeposit: {
        basic: BigInt('0'),
        foundry: BigInt('0'),
        nft: BigInt('0'),
        account: BigInt('0'),
        delegation: BigInt('0'),
    },
}
