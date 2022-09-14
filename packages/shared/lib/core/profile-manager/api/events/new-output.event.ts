import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { Activity } from '@core/wallet/classes/activity.class'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { get } from 'svelte/store'
import { NewOutputEvent } from '../types'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { convertEd25519ToBech32 } from '@core/wallet/utils/convertEd25519ToBech32'

export function handleNewOutputEvent(accountId: string, event: NewOutputEvent): void {
    const account = get(activeAccounts)?.find((account) => account.id === accountId)
    const output = event?.output

    const address =
        output?.address?.type === ADDRESS_TYPE_ED25519 ? convertEd25519ToBech32(output.address.pubKeyHash) : ''

    const isNewAliasOutput = output.output.type === OUTPUT_TYPE_ALIAS && output.output.stateIndex === 0

    if ((account.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        syncBalance(account.id)

        const processedOutput = preprocessGroupedOutputs(
            [output],
            [event?.transaction, event?.transactionInputs],
            account
        )[0]
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedOutput, account))
    }
}
