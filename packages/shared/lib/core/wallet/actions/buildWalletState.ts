import { AccountOutput, Balance, OutputData } from '@iota/sdk/out/types'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { IWallet } from '@core/profile/interfaces'
import { getDepositAddress } from '../utils/getDepositAddress'
import { mainAccountId, updateMainAccountId } from '../stores'
import { get } from 'svelte/store'
import { getBlockIssuerAccounts } from '../utils'

export async function buildWalletState(
    wallet: IWallet,
    walletPersistedData: IPersistedWalletData
): Promise<IWalletState> {
    let balances: Balance = {
        baseCoin: {
            total: BigInt(0),
            available: BigInt(0),
            votingPower: '0',
        },
        requiredStorageDeposit: {
            account: BigInt(0),
            basic: BigInt(0),
            foundry: BigInt(0),
            nft: BigInt(0),
            delegation: BigInt(0),
        },
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        accounts: [],
        delegations: [],
    }

    let depositAddress = ''
    let votingPower = ''
    let walletOutputs: OutputData[] = []
    let accountOutputs: OutputData[] = []
    let implicitAccountOutputs: OutputData[] = []

    try {
        balances = await wallet.getBalance()
        depositAddress = await getDepositAddress(wallet)
        votingPower = balances.baseCoin.votingPower
        accountOutputs = await wallet.accounts()
        implicitAccountOutputs = await wallet.implicitAccounts()
        walletOutputs = await wallet.outputs()
        if (accountOutputs.length && !get(mainAccountId)) {
            const blockIssuerAccounts = await getBlockIssuerAccounts(wallet)
            if (blockIssuerAccounts.length > 0) {
                const accountId = (blockIssuerAccounts[0]?.output as AccountOutput).accountId
                updateMainAccountId(accountId, wallet.id)
            }
        }
    } catch (err) {
        console.error(err)
    }

    return {
        ...wallet,
        ...walletPersistedData,
        depositAddress,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        hasConsolidatingOutputsTransactionInProgress: false,
        isTransferring: false,
        votingPower,
        walletOutputs,
        accountOutputs,
        implicitAccountOutputs,
    } as IWalletState
}
