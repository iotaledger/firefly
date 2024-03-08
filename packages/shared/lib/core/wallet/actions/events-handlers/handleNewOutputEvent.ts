import { addNftsToDownloadQueue, addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import { activeWallets, updateActiveWallet } from '@core/profile'
import { checkAndRemoveProfilePicture, updateActiveWalletPersistedData } from '@core/profile/actions'
import {
    ActivityType,
    IWrappedOutput,
    WalletApiEventHandler,
    addActivitiesToWalletActivitiesInAllWalletActivities,
    addPersistedAsset,
    generateActivities,
    getBech32AddressFromAddressTypes,
    getOrRequestAssetFromPersistedAssets,
    hasBlockIssuerFeature,
    isAccountOutput,
    isDelegationOutput,
    isImplicitAccountOutput,
    preprocessGroupedOutputs,
    syncBalance,
    validateWalletApiEvent,
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

    const address = outputData.address ? getBech32AddressFromAddressTypes(outputData.address) : undefined

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

        const processedOutput = preprocessGroupedOutputs([outputData], payload?.transactionInputs ?? [], wallet)

        const activities = await generateActivities(processedOutput, wallet)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                if (asset) {
                    addPersistedAsset(asset)
                }
            }
        }
        addActivitiesToWalletActivitiesInAllWalletActivities(wallet.id, activities)
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
                    depositAddress: getBech32AddressFromAddressTypes(new AccountAddress(mainAccountId)),
                })
            } else {
                updateActiveWallet(walletId, {
                    hasImplicitAccountCreationTransactionInProgress: false,
                    isTransferring: false,
                })
            }
        }
    }

    // TODO: update this logic when available balance is fixed
    if (isDelegationOutput(outputData)) {
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
