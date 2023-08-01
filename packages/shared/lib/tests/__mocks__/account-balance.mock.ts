import { Balance } from '@iota/wallet'

export const MOCK_ACCOUNT_BALANCE: Balance = {
    baseCoin: {
        total: BigInt('10000'),
        available: BigInt('9000'),
        votingPower: '0',
    },
    aliases: [],
    foundries: [],
    nativeTokens: [],
    nfts: [],
    potentiallyLockedOutputs: {},
    requiredStorageDeposit: {
        alias: BigInt('0'),
        basic: BigInt('0'),
        foundry: BigInt('0'),
        nft: BigInt('0'),
    },
}
