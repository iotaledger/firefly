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

    const address = getBech32AddressFromAddressTypes(outputData.address)

    if (wallet?.depositAddress === address && !outputData?.remainder) {
        await syncBalance(wallet.id)
        const walletOutputs = await wallet.outputs()
        const accountOutputs = await wallet.accounts()
        const implicitAccountOutputs = await wallet.implicitAccounts()
        updateActiveWallet(wallet.id, { walletOutputs, accountOutputs, implicitAccountOutputs })

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

    const isAccountOutput = output.type === OutputType.Account
    if (isAccountOutput) {
        const accountOutput = output as AccountOutput
        // TODO: move to packages/shared/lib/core/wallet/actions/events-handlers/handleTransactionInclusionEvent.ts
        // when https://github.com/iotaledger/firefly/pull/7926 is merged and we can have ActivityType.Account

        // if we receive the first account output, we set it as the mainAccountId of the wallet
        if (
            !wallet.mainAccountId &&
            wallet?.hasImplicitAccountCreationTransactionInProgress &&
            hasBlockIssuerFeature(accountOutput)
        ) {
            wallet.mainAccountId = accountOutput.accountId
            updateActiveWalletPersistedData(walletId, {
                mainAccountId: wallet.mainAccountId,
            })
            updateActiveWallet(walletId, {
                hasImplicitAccountCreationTransactionInProgress: false,
                isTransferring: false,
                depositAddress: getBech32AddressFromAddressTypes(new AccountAddress(wallet.mainAccountId)),
            })
        }
    }

    const isNftOutput = output.type === OutputType.Nft
    if (isNftOutput) {
        const wrappedOutput = outputData as unknown as IWrappedOutput
        const nft = buildNftFromNftOutput(wrappedOutput, wallet.depositAddress)
        addOrUpdateNftInAllWalletNfts(wallet.id, nft)
        void addNftsToDownloadQueue(walletId, [nft])

        checkAndRemoveProfilePicture()
    }
}
