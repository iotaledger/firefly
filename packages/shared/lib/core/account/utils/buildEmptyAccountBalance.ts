import { IAccountBalance } from '@core/account'

export function buildEmptyAccountBalance(): IAccountBalance {
    return {
        baseCoin: {
            total: '0',
            available: '0',
        },
        requiredStorageDeposit: '',
        nativeTokens: [],
        nfts: [],
        aliases: [],
        foundries: [],
        potentiallyLockedOutputs: {},
    }
}
