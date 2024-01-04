import { Balance, OutputData } from '@iota/sdk/out/types'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { IWallet } from '@core/profile/interfaces'
import { getAddressesWithOutputs } from './getAddressesWithOutputs'
import { getDepositAddress } from '../utils'

// TODO(2.0): Fix usages of buildAccountState
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
    let accountsOutput: OutputData[] = []
    let implicitAccountsOutput: OutputData[] = []

    try {
        balances = await wallet.getBalance()
        depositAddress = await getDepositAddress(wallet)
        votingPower = balances.baseCoin.votingPower
        accountsOutput = await wallet.accounts()
        implicitAccountsOutput = await wallet.implicitAccounts()
    } catch (err) {
        console.error(err)
    }

    // TODO(2.0) Fix
    const addressesWithOutputs = await getAddressesWithOutputs(wallet)

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
        addressesWithOutputs,
        accountsOutput,
        implicitAccountsOutput,
    } as IWalletState
}
