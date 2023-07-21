import { Event, NewOutputWalletEvent } from '@iota/wallet'
import { WalletEventType } from '@iota/wallet/out/types'

import { syncBalance } from '@core/account/actions/syncBalance'
import { addNftsToDownloadQueue, addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput } from '@core/nfts'
import { checkAndRemoveProfilePicture } from '@core/profile/actions'
import { activeAccounts } from '@core/profile/stores'
import {
    ActivityType,
    IWrappedOutput,
    addPersistedAsset,
    generateActivities,
    getOrRequestAssetFromPersistedAssets,
} from '@core/wallet'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/wallet/stores/all-account-activities.store'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'

export function handleNewOutputEvent(error: Error, rawEvent: Event): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
    const type = payload.type
    if (type === WalletEventType.NewOutput) {
        void handleNewOutputEventInternal(accountIndex, payload as NewOutputWalletEvent)
    }
}

export async function handleNewOutputEventInternal(accountIndex: number, payload: NewOutputWalletEvent): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = payload.output

    if (!account || !output) return

    const address = getBech32AddressFromAddressTypes(output?.address)
    const isNewAliasOutput =
        output.output.type === OUTPUT_TYPE_ALIAS &&
        output.output.stateIndex === 0 &&
        !get(allAccountActivities)[accountIndex].find((_activity) => _activity.id === output.outputId)
    const isNftOutput = output.output.type === OUTPUT_TYPE_NFT

    if ((account?.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)

        const processedOutput = preprocessGroupedOutputs([output], payload?.transactionInputs ?? [], account)

        const activities = await generateActivities(processedOutput, account)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                addPersistedAsset(asset)
            }
        }
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
    }

    if (isNftOutput) {
        const nft = buildNftFromNftOutput(output as IWrappedOutput, account.depositAddress)
        addOrUpdateNftInAllAccountNfts(account.index, nft)
        void addNftsToDownloadQueue(accountIndex, [nft])

        checkAndRemoveProfilePicture()
    }
}
