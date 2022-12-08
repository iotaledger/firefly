import { AccountBalance } from '@iota/wallet'

export const MOCK_ACCOUNT_BALANCE: AccountBalance = {
    baseCoin: {
        total: '10000',
        available: '9000',
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
