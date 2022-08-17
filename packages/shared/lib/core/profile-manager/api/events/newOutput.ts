import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { Activity } from '@core/wallet/classes/activity.class'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { ADDRESS_TYPE_ED25519 } from '@core/wallet/constants'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { get } from 'svelte/store'
import { NewOutputEvent } from '../types/newOutputEvent'
import { preprocessOutput } from '@core/wallet'

export function handleNewOutputEvent(accountId: string, event: NewOutputEvent): void {
    const account = get(activeAccounts)?.find((account) => account.id === accountId)
    const output = event?.output

    const address =
        output?.address?.type === ADDRESS_TYPE_ED25519
            ? Bech32Helper.toBech32(0, Converter.hexToBytes(output?.address?.pubKeyHash?.substring(2)), 'rms')
            : ''
    if (output?.address?.type === ADDRESS_TYPE_ED25519 && account?.depositAddress === address && !output?.remainder) {
        syncBalance(account.id)

        const processedOutput = preprocessOutput([output], [event?.transaction, event?.transactionInputs])
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedOutput, account))
    }
}
