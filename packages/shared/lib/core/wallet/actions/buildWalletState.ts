import { AccountOutput, Balance, OutputData } from '@iota/sdk/out/types'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { IWallet } from '@core/profile/interfaces'
import { selectedWalletMainAccountId, updateSelectedWalletMainAccountId } from '../stores'
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

    let votingPower = ''
    let walletOutputs: OutputData[] = []
    let accountOutputs: OutputData[] = []
    let implicitAccountOutputs: OutputData[] = []

    try {
        balances = await wallet.getBalance()
        votingPower = balances.baseCoin.votingPower
        accountOutputs = await wallet.accounts()
        implicitAccountOutputs = await wallet.implicitAccounts()
        walletOutputs = await wallet.outputs()

        // initialize selectedWalletMainAccountId if there is none set so the wallet can be used
        // TODO: check that selectedWalletMainAccountId is still an owned account
        const _selectedWalletMainAccountId = get(selectedWalletMainAccountId)
        const blockIssuerAccounts = await getBlockIssuerAccounts(wallet)

        // check if the current selectedWalletMainAccountId is still owned by the wallet
        if (
            _selectedWalletMainAccountId &&
            !blockIssuerAccounts.find(
                (account) => (account?.output as AccountOutput)?.accountId === _selectedWalletMainAccountId
            )
        ) {
            updateSelectedWalletMainAccountId(undefined)
        }
    } catch (err) {
        console.error(err)
    }

    return {
        ...wallet,
        ...walletPersistedData,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        hasConsolidatingOutputsTransactionInProgress: false,
        hasImplicitAccountCreationTransactionInProgress: false,
        isTransferring: false,
        votingPower,
        walletOutputs,
        accountOutputs,
        implicitAccountOutputs,
    } as IWalletState
}
