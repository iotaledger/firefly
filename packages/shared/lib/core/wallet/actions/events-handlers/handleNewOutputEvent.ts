import { Event, NewOutputWalletEvent, OutputType, WalletEventType } from '@iota/sdk/out/types'

import { getAddressesWithOutputs } from '@core/account'
import { syncBalance } from '@core/account/actions/syncBalance'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'
import {
    ActivityType,
    IWrappedOutput,
    addPersistedAsset,
    generateActivities,
    getOrRequestAssetFromPersistedAssets,
} from '@core/wallet'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/wallet/stores/all-account-activities.store'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../../profile-manager/utils'

export function handleNewOutputEvent(error: Error, rawEvent: Event): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
    const type = payload.type
    if (type === WalletEventType.NewOutput) {
        void handleNewOutputEventInternal(accountIndex, payload as NewOutputWalletEvent)
    }
}

export async function handleNewOutputEventInternal(accountIndex: number, payload: NewOutputWalletEvent): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const outputData = payload.output

    if (!account || !outputData) return

    const output = outputData.output

    const address = getBech32AddressFromAddressTypes(outputData.address)
    const isNewAliasOutput =
        output.type === OutputType.Account &&
        !get(allAccountActivities)[accountIndex].find((_activity) => _activity.id === outputData.outputId)
    const isNftOutput = output.type === OutputType.Nft

    if ((account?.depositAddress === address && !outputData?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)
        const addressesWithOutputs = await getAddressesWithOutputs(account)
        updateActiveAccount(account.index, { addressesWithOutputs })

        const processedOutput = preprocessGroupedOutputs([outputData], payload?.transactionInputs ?? [], account)

        const activities = await generateActivities(processedOutput, account)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                if (asset) {
                    addPersistedAsset(asset)
                }
            }
        }
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
    }

    if (isNftOutput) {
        const wrappedOutput = outputData as unknown as IWrappedOutput
        const nft = buildNftFromNftOutput(wrappedOutput, account.depositAddress)
        addOrUpdateNftInAllAccountNfts(account.index, nft)
        void addNftsToDownloadQueue(accountIndex, [nft])

        checkAndRemoveProfilePicture()
    }
}
