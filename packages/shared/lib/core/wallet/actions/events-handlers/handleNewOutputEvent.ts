import { addNftsToDownloadQueue, addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import { activeWallets, updateActiveWallet } from '@core/profile'
import { checkAndRemoveProfilePicture, updateActiveWalletPersistedData } from '@core/profile/actions'
import {
    ActivityType,
    IWrappedOutput,
    WalletApiEventHandler,
    addPersistedAsset,
    AddressConverter,
    getOrRequestAssetFromPersistedAssets,
    hasBlockIssuerFeature,
    isAccountOutput,
    isDelegationOutput,
    isImplicitAccountOutput,
    preprocessGroupedOutputs,
    syncBalance,
    validateWalletApiEvent,
    DEFAULT_SYNC_OPTIONS,
    ActivityBase,
    selectedWalletActivities,
} from '@core/wallet'
import {
    AccountAddress,
    AccountOutput,
    NewOutputWalletEvent,
    OutputType,
    WalletEvent,
    WalletEventType,
} from '@iota/sdk/out/types'
import { closePopup } from 'shared/lib/auxiliary/popup'
import { get } from 'svelte/store'

export function handleNewOutputEvent(walletId: string): WalletApiEventHandler {
    return (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
        if (rawEvent.type === WalletEventType.NewOutput) {
            void handleNewOutputEventInternal(walletId, rawEvent as NewOutputWalletEvent)
        }
    }
}

export async function handleNewOutputEventInternal(walletId: string, payload: NewOutputWalletEvent): Promise<void> {
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const outputData = payload.output

    if (!wallet || !outputData) return

    const output = outputData.output
    const isNftOutput = output.type === OutputType.Nft
    let _isDelegationOutput = isDelegationOutput(outputData)

    const address = outputData.address ? AddressConverter.addressToBech32(outputData.address) : undefined

    // TODO: Improve this logic when the delegation output is received -> https://github.com/iotaledger/firefly/issues/8187
    if (wallet?.hasDelegationTransactionInProgress) {
        const prevDelegationOutputs = wallet.walletUnspentOutputs?.filter(isDelegationOutput) || []
        await wallet.sync(DEFAULT_SYNC_OPTIONS)
        const postDelegationOutputs = (await wallet.unspentOutputs())?.filter(isDelegationOutput) || []
        if (prevDelegationOutputs.length < postDelegationOutputs.length) {
            _isDelegationOutput = true
        }
    }

    // The basic outputs of the faucet dont have an address
    const isBasicOutput = output.type === OutputType.Basic
    if (
        (address && wallet?.depositAddress === address && !outputData?.remainder) ||
        isAccountOutput(outputData) ||
        isDelegationOutput(outputData) ||
        isBasicOutput
    ) {
        await syncBalance(wallet.id, true)
        const walletOutputs = await wallet.outputs()
        const walletUnspentOutputs = await wallet.unspentOutputs()
        const accountOutputs = await wallet.accounts()
        updateActiveWallet(wallet.id, { walletOutputs, accountOutputs, walletUnspentOutputs })

        const processedTransaction = preprocessGroupedOutputs([outputData], payload?.transactionInputs ?? [], wallet)

        const activities = await ActivityBase.generateActivitiesFromProcessedTransaction(wallet, processedTransaction)
        for (const activity of activities) {
            if (activity.type() === ActivityType.Transaction || activity.type() === ActivityType.Foundry) {
                selectedWalletActivities.update((activities) => [...activities, activity])
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId())
                if (asset) {
                    addPersistedAsset(asset)
                }
            }
        }
    }
    if (isImplicitAccountOutput(outputData)) {
        await syncBalance(wallet.id, true)
        const implicitAccountOutputs = await wallet.implicitAccounts()
        updateActiveWallet(wallet.id, { implicitAccountOutputs })
    }
    if (isAccountOutput(outputData)) {
        const accountOutput = output as AccountOutput

        // if we receive the first account output, we set it as the mainAccountId of the wallet
        if (wallet?.hasImplicitAccountCreationTransactionInProgress && hasBlockIssuerFeature(accountOutput)) {
            if (!wallet.mainAccountId) {
                const mainAccountId = accountOutput.accountId
                updateActiveWalletPersistedData(walletId, {
                    mainAccountId,
                })
                updateActiveWallet(walletId, {
                    hasImplicitAccountCreationTransactionInProgress: false,
                    isTransferring: false,
                    depositAddress: AddressConverter.addressToBech32(new AccountAddress(mainAccountId)),
                })
            } else {
                updateActiveWallet(walletId, {
                    hasImplicitAccountCreationTransactionInProgress: false,
                    isTransferring: false,
                })
            }
            closePopup() // Close ActivateAccountPopup when account is activated
        }
    }

    // TODO: update this logic when available balance is fixed
    if (_isDelegationOutput) {
        if (wallet?.hasDelegationTransactionInProgress) {
            updateActiveWallet(walletId, {
                hasDelegationTransactionInProgress: false,
                isTransferring: false,
            })
            closePopup() // close CreateDelegationPopup when the account output is created
        }
    }
    if (isNftOutput) {
        const wrappedOutput = outputData as unknown as IWrappedOutput
        const nft = buildNftFromNftOutput(wrappedOutput, wallet.depositAddress)
        addOrUpdateNftInAllWalletNfts(wallet.id, nft)
        void addNftsToDownloadQueue(walletId, [nft])

        checkAndRemoveProfilePicture()
    }
}
