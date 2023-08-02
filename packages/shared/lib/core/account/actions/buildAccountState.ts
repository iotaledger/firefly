import { Balance } from '@iota/wallet'

import { getDepositAddress } from '@core/account/utils'

import { IAccount, IAccountState, IPersistedAccountData } from '../interfaces'
import { getAddressesWithOutputs } from './getAddressesWithOutputs'

export async function buildAccountState(
    account: IAccount,
    accountPersistedData: IPersistedAccountData
): Promise<IAccountState> {
    let balances: Balance = {
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
    let depositAddress = ''
    let votingPower = ''
    try {
        balances = await account.getBalance()
        depositAddress = await getDepositAddress(account)
        votingPower = balances.baseCoin.votingPower
    } catch (err) {
        console.error(err)
    }
    const addressesWithOutputs = await getAddressesWithOutputs(account)

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
        addressesWithOutputs,
    } as IAccountState
}
