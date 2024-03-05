import { IWallet } from '@core/profile/interfaces'
import { AccountAddress, AccountOutput, Balance, OutputData, OutputType } from '@iota/sdk/out/types'
import { updateWalletPersistedDataOnActiveProfile } from '@core/profile'
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface'
import { IWalletState } from '../interfaces/wallet-state.interface'
import { getBech32AddressFromAddressTypes, getBlockIssuerAccounts } from '../utils'

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

    let walletOutputs: OutputData[] = []
    let accountOutputs: OutputData[] = []
    let implicitAccountOutputs: OutputData[] = []
    let depositAddress = ''

    try {
        balances = await wallet.getBalance()
        accountOutputs = await wallet.accounts()
        // check if the mainAccountId is still valid
        if (
            walletPersistedData.mainAccountId &&
            !accountOutputs.find(
                (output) =>
                    output.output.type === OutputType.Account &&
                    (output as unknown as AccountOutput).accountId === walletPersistedData.mainAccountId
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
            ? getBech32AddressFromAddressTypes(new AccountAddress(walletPersistedData.mainAccountId))
            : ''
        implicitAccountOutputs = await wallet.implicitAccounts()
        walletOutputs = await wallet.outputs()
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
        isTransferring: false,
        walletOutputs,
        accountOutputs,
        depositAddress,
        implicitAccountOutputs,
    } as IWalletState
}
