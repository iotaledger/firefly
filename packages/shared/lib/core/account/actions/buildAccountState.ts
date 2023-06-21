import { AccountBalance } from '@iota/wallet'

import { getDepositAddress } from '@core/account/utils'
import {
    getActiveProfilePersistedTrackedTokensByAccountIndex,
    updateAccountPersistedDataOnActiveProfile,
} from '@core/profile/stores'

import { IAccount, IAccountState, IPersistedAccountData } from '../interfaces'

export async function buildAccountState(
    account: IAccount,
    accountPersistedData: IPersistedAccountData
): Promise<IAccountState> {
    let balances: AccountBalance = {
        baseCoin: {
            total: '0',
            available: '0',
            votingPower: '0',
        },
        requiredStorageDeposit: {
            alias: '0',
            basic: '0',
            foundry: '0',
            nft: '0',
        },
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        aliases: [],
    }
    const accountIndex = account.getMetadata().index
    const trackedTokens = getActiveProfilePersistedTrackedTokensByAccountIndex(accountIndex)
    let depositAddress = accountPersistedData.depositAddress
    let votingPower = ''
    try {
        balances = await account.getBalance()
        votingPower = balances.baseCoin.votingPower

        if (!depositAddress) {
            depositAddress = await getDepositAddress(account)
            updateAccountPersistedDataOnActiveProfile(accountIndex, { depositAddress })
        }
    } catch (err) {
        console.error(err)
    }

    return {
        index: accountIndex,
        ...account,
        ...accountPersistedData,
        depositAddress,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        isTransferring: false,
        votingPower,
        trackedTokens,
    }
}
