import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { convertEd25519ToBech32, getOrRequestAssetFromPersistedAssets } from '@core/wallet'
import { Activity } from '@core/wallet/classes/activity.class'
import { ADDRESS_TYPE_ED25519 } from '@core/wallet/constants'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
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
    const account = get(activeAccounts)?.find((account) => account.id === accountIndex.toString())
    const output = payload?.output

    const address =
        output?.address?.type === ADDRESS_TYPE_ED25519 ? convertEd25519ToBech32(output?.address?.pubKeyHash) : ''

    if (output?.address?.type === ADDRESS_TYPE_ED25519 && account?.depositAddress === address && !output?.remainder) {
        await syncBalance(account.id)

        const processedOutput = preprocessGroupedOutputs(
            [output],
            [payload?.transaction, payload?.transactionInputs],
            account
        )
        const activity = new Activity(processedOutput, account)
        await getOrRequestAssetFromPersistedAssets(activity.data?.assetId)
        addActivityToAccountActivitiesInAllAccountActivities(account.id, activity)
    }
}
