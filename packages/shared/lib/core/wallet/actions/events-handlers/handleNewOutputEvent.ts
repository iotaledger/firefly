import {
    WalletEvent,
    NewOutputWalletEvent,
    OutputType,
    WalletEventType,
    CommonOutput,
    UnlockConditionType,
    AddressType,
    AddressUnlockCondition,
    AccountOutput,
} from '@iota/sdk/out/types'
import { addNftsToDownloadQueue, addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import {
    ActivityType,
    IWrappedOutput,
    addPersistedAsset,
    generateActivities,
    getOrRequestAssetFromPersistedAssets,
    syncBalance,
    validateWalletApiEvent,
    getBech32AddressFromAddressTypes,
    preprocessGroupedOutputs,
    addActivitiesToWalletActivitiesInAllWalletActivities,
    WalletApiEventHandler,
    updateSelectedWallet,
    updateSelectedWalletMainAccountId,
    selectedWalletMainAccountId,
    hasBlockIssuerFeature,
    getDepositAddress,
} from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, updateActiveWallet } from '@core/profile'

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

    const isImplicitAccountOutput =
        output.type === OutputType.Basic &&
        (output as CommonOutput).unlockConditions.length === 1 &&
        (
            (output as CommonOutput).unlockConditions.find(
                (cmnOutput) => cmnOutput.type === UnlockConditionType.Address
            ) as AddressUnlockCondition
        )?.address.type === AddressType.ImplicitAccountCreation

    if (isImplicitAccountOutput) {
        const implicitAccounts = await wallet.implicitAccounts()
        updateSelectedWallet({
            implicitAccountOutputs: implicitAccounts,
        })
        return
    }

    const isAccountOutput = output.type === OutputType.Account

    if (isAccountOutput) {
        const accountOutput = output as AccountOutput
        const accountOutputs = await wallet.accounts()
        const depositAddress = await getDepositAddress(wallet)
        updateSelectedWallet({
            accountOutputs,
            depositAddress,
        })

        // if we receive the first account output, we set it as the selectedWalletMainAccountId
        // TODO: move to packages/shared/lib/core/wallet/actions/events-handlers/handleTransactionInclusionEvent.ts
        // when https://github.com/iotaledger/firefly/pull/7926 is merged and we can have ActivityType.Account
        if (
            !get(selectedWalletMainAccountId) &&
            wallet?.hasImplicitAccountCreationTransactionInProgress &&
            hasBlockIssuerFeature(accountOutput)
        ) {
            updateSelectedWalletMainAccountId(accountOutput.accountId)
            updateActiveWallet(walletId, {
                hasImplicitAccountCreationTransactionInProgress: false,
                isTransferring: false,
            })
        }
        return
    }

    const address = getBech32AddressFromAddressTypes(outputData.address)

    const isNftOutput = output.type === OutputType.Nft

    if (wallet?.depositAddress === address && !outputData?.remainder) {
        await syncBalance(wallet.id)
        const walletOutputs = await wallet.outputs()
        updateActiveWallet(wallet.id, { walletOutputs })

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

    if (isNftOutput) {
        const wrappedOutput = outputData as unknown as IWrappedOutput
        const nft = buildNftFromNftOutput(wrappedOutput, wallet.depositAddress)
        addOrUpdateNftInAllWalletNfts(wallet.id, nft)
        void addNftsToDownloadQueue(walletId, [nft])

        checkAndRemoveProfilePicture()
    }
}
