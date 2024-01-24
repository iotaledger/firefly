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
    allWalletActivities,
    syncBalance,
    validateWalletApiEvent,
    getBech32AddressFromAddressTypes,
    preprocessGroupedOutputs,
    addActivitiesToWalletActivitiesInAllWalletActivities,
    WalletApiEventHandler,
    updateSelectedWallet,
    getDepositAddress,
    updateMainAccountId,
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
        const accounts = await wallet.accounts()
        if (accounts.length === 1) {
            const accountId = (accounts[0]?.output as AccountOutput).accountId
            updateMainAccountId(accountId)
            const depositAddress = await getDepositAddress(wallet)
            updateSelectedWallet({
                accountOutputs: accounts,
                depositAddress,
            })
        } else {
            updateSelectedWallet({
                accountOutputs: accounts,
            })
        }
        return
    }

    const address = getBech32AddressFromAddressTypes(outputData.address)
    const isNewAliasOutput =
        output.type === OutputType.Account &&
        !get(allWalletActivities)[walletId].find((_activity) => _activity.id === outputData.outputId)
    const isNftOutput = output.type === OutputType.Nft

    if ((wallet?.depositAddress === address && !outputData?.remainder) || isNewAliasOutput) {
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
