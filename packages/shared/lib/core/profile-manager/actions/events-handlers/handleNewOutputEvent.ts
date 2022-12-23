import { syncBalance } from '@core/account/actions/syncBalance'
import { addOrUpdateNftInAllAccountNfts, buildNftFromNftOutput, getIsSpendableFromUnspentNftOutput } from '@core/nfts'
import { activeAccounts } from '@core/profile/stores'
import { ActivityType, addPersistedAsset, generateActivities, getOrRequestAssetFromPersistedAssets } from '@core/wallet'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import {
    addActivitiesToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/wallet/stores/all-account-activities.store'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { INftOutput } from '@iota/types'
import { get } from 'svelte/store'
import { WalletApiEvent } from '../../enums'
import { INewOutputEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleNewOutputEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.NewOutput)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    void handleNewOutputEventInternal(accountIndex, payload as INewOutputEventPayload)
}

export async function handleNewOutputEventInternal(
    accountIndex: number,
    payload: INewOutputEventPayload
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = payload?.output

    const address = getBech32AddressFromAddressTypes(output?.address)
    const isNewAliasOutput =
        output.output.type === OUTPUT_TYPE_ALIAS &&
        output.output.stateIndex === 0 &&
        !get(allAccountActivities)[accountIndex].find((_activity) => _activity.id === output.outputId)
    const isNftOutput = output.output.type === OUTPUT_TYPE_NFT

    if ((account.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)

        const processedOutput = preprocessGroupedOutputs([output], payload?.transactionInputs ?? [], account)

        const activities = generateActivities(processedOutput, account)
        for (const activity of activities) {
            if (activity.type === ActivityType.Basic || activity.type === ActivityType.Foundry) {
                const asset = await getOrRequestAssetFromPersistedAssets(activity.assetId)
                addPersistedAsset(asset)
            }
        }
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
    }

    if (isNftOutput) {
        const isSpendable = getIsSpendableFromUnspentNftOutput(account.depositAddress, output.output as INftOutput)
        const nft = buildNftFromNftOutput(output.output as INftOutput, output.outputId, isSpendable)
        addOrUpdateNftInAllAccountNfts(account.index, nft)
    }
}
