import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { Activity } from '@core/wallet/classes/activity.class'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'
import { get } from 'svelte/store'
import { NewOutputEvent } from '../types/newOutputEvent'

export function handleNewOutputEvent(event: NewOutputEvent): void {
    for (const account of get(activeAccounts)) {
        const address =
            event.output.address?.type === 0
                ? Bech32Helper.toBech32(0, Converter.hexToBytes(event.output.address.pubKeyHash.substring(2)), 'rms')
                : ''
        if (event.output.address.type === 0 && account.depositAddress === address && !event.output.remainder) {
            syncBalance(account.id)
            addActivityToAccountActivitiesInAllAccountActivities(
                account.id,
                new Activity().setFromOutput(event.output.outputId, event.output, account.depositAddress, false, false)
            )
        }
    }
}
