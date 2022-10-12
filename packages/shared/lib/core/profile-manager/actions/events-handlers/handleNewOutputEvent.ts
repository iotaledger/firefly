import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { getOrRequestAssetFromPersistedAssets } from '@core/wallet'
import { Activity } from '@core/wallet/classes/activity.class'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    allAccountActivities,
} from '@core/wallet/stores/all-account-activities.store'
import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { get } from 'svelte/store'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { WalletApiEvent } from '../../enums'
import { INewOutputEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'
import { getBech32AddressFromAddressTypes } from '@core/wallet/utils/getBech32AddressFromAddressTypes'

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

    if ((account.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        await syncBalance(account.index)

        const processedOutput = preprocessGroupedOutputs(
            [output],
            [payload?.transaction, payload?.transactionInputs],
            account
        )
        const activity = new Activity(processedOutput, account)
        await getOrRequestAssetFromPersistedAssets(activity.data?.assetId)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
    }
}
