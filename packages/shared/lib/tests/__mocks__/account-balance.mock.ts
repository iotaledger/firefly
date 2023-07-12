import { Balance } from '@iota/wallet'

export const MOCK_ACCOUNT_BALANCE: Balance = {
    baseCoin: {
        total: '10000',
        available: '9000',
        votingPower: '0',
    },
    aliases: [],
    foundries: [],
    nativeTokens: [],
    nfts: [],
    potentiallyLockedOutputs: {},
    requiredStorageDeposit: {
        alias: '0',
        basic: '0',
        foundry: '0',
        nft: '0',
    },
}
