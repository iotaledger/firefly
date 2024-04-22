import { IWallet } from '@core/profile/interfaces'
import { AccountAddress, AccountOutput, Balance, OutputData, OutputType } from '@iota/sdk/out/types'
import { updateWalletPersistedDataOnActiveProfile } from '@core/profile'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { AddressConverter, getBlockIssuerAccounts } from '../utils'
import { DEFAULT_SYNC_OPTIONS, getTotalWalletBalance } from '..'

export async function buildWalletState(
    wallet: IWallet,
    walletPersistedData: IPersistedWalletData
): Promise<IWalletState> {
    let balances: Balance = {
        baseCoin: {
            total: BigInt(0),
            available: BigInt(0),
            votingPower: BigInt(0),
        },
        mana: {
            total: {
                stored: BigInt(0),
                potential: BigInt(0),
            },
            available: {
                stored: BigInt(0),
                potential: BigInt(0),
            },
            rewards: BigInt(0),
        },
        requiredStorageDeposit: {
            account: BigInt(0),
            basic: BigInt(0),
            foundry: BigInt(0),
            nft: BigInt(0),
            delegation: BigInt(0),
        },
        nativeTokens: {},
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        accounts: [],
        delegations: [],
    }

    let votingPower = ''
    let walletOutputs: OutputData[] = []
    let walletUnspentOutputs: OutputData[] = []
    let accountOutputs: OutputData[] = []
    let implicitAccountOutputs: OutputData[] = []
    let depositAddress = ''

    try {
        await wallet.sync(DEFAULT_SYNC_OPTIONS)
        accountOutputs = await wallet.accounts()
        balances = await getTotalWalletBalance(wallet, accountOutputs)
        // check if the mainAccountId is still valid
        if (
            walletPersistedData.mainAccountId &&
            !accountOutputs.find(
                (output) =>
                    output.output.type === OutputType.Account &&
                    (output.output as unknown as AccountOutput).accountId === walletPersistedData.mainAccountId
            )
        ) {
            updateWalletPersistedDataOnActiveProfile(wallet.id, { mainAccountId: undefined })
            walletPersistedData.mainAccountId = undefined
        }
        // if there is no mainAccountId, try to set the first account from the block issuer accounts
        if (!walletPersistedData.mainAccountId) {
            const blockIssuerAccounts = await getBlockIssuerAccounts(wallet)
            if (blockIssuerAccounts.length > 0) {
                const mainAccountId = (blockIssuerAccounts[0]?.output as AccountOutput)?.accountId
                updateWalletPersistedDataOnActiveProfile(wallet.id, { mainAccountId })
                walletPersistedData.mainAccountId = mainAccountId
            }
        }
        depositAddress = walletPersistedData.mainAccountId
            ? AddressConverter.addressToBech32(new AccountAddress(walletPersistedData.mainAccountId))
            : ''
        implicitAccountOutputs = await wallet.implicitAccounts()
        walletOutputs = await wallet.outputs()
        walletUnspentOutputs = await wallet.unspentOutputs()
        votingPower = balances.baseCoin.votingPower.toString()
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
        hasDelegationTransactionInProgress: false,
        hasDelegationRewardClaimTransactionInProgress: false,
        isTransferring: false,
        votingPower,
        walletOutputs,
        walletUnspentOutputs,
        accountOutputs,
        depositAddress,
        implicitAccountOutputs,
    } as IWalletState
}
