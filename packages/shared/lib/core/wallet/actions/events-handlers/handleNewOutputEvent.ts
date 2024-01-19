import {
    WalletEvent,
    NewOutputWalletEvent,
    OutputType,
    WalletEventType,
    CommonOutput,
    UnlockConditionType,
    AddressType,
    AddressUnlockCondition,
} from '@iota/sdk/out/types'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import {
    ActivityType,
    IWrappedOutput,
    addPersistedAsset,
    generateActivities,
    getOrRequestAssetFromPersistedAssets,
    allWalletActivities,
    getAddressesWithOutputs,
    syncBalance,
    validateWalletApiEvent,
    getBech32AddressFromAddressTypes,
    preprocessGroupedOutputs,
    addActivitiesToWalletActivitiesInAllWalletActivities,
    WalletApiEventHandler,
    updateSelectedWallet,
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

// TODO(2.0) Use wallet instead of accounts and fix all usages
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

    const address = getBech32AddressFromAddressTypes(outputData.address)
    const isNewAliasOutput =
        output.type === OutputType.Account &&
        !get(allWalletActivities)[walletId].find((_activity) => _activity.id === outputData.outputId)
    const isNftOutput = output.type === OutputType.Nft

    const isAccountOutput = output.type === OutputType.Account

    if ((wallet?.depositAddress === address && !outputData?.remainder) || isNewAliasOutput) {
        await syncBalance(wallet.id)
        const addressesWithOutputs = await getAddressesWithOutputs(wallet)
        updateActiveWallet(wallet.id, { addressesWithOutputs })

        const processedOutput = preprocessGroupedOutputs([outputData], payload?.transactionInputs ?? [], account)

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
        addOrUpdateNftInAllAccountNfts(wallet.id, nft)
        void addNftsToDownloadQueue(walletId, [nft])

        checkAndRemoveProfilePicture()
    }

    if (isAccountOutput) {
        const accounts = await wallet.accounts()
        const depositAddress = await getDepositAddress()
        updateSelectedWallet({
            accountOutputs: accounts,
            depositAddress,
        })
    }
}
