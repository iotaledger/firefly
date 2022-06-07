import { activeAccounts } from '@core/profile'
import { convertBech32AddressToEd25519Address } from '@lib/ed25519'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    addEmptyAccountActivitiesToAllAccountActivities,
} from '../stores'

export function loadAllAccountActivities(): void {
    for (const account of get(activeAccounts)) {
        addEmptyAccountActivitiesToAllAccountActivities(account.id)

        // TODO: Dont transfrom account address to ED25519, instead transform output addresses to bech
        const address = convertBech32AddressToEd25519Address(account.meta.publicAddresses[0].address)
        Object.keys(account.meta.transactions).forEach((transactionId) => {
            addActivityToAccountActivitiesInAllAccountActivities(
                account.id,
                new Activity().setFromTransaction(transactionId, account.meta.transactions?.[transactionId])
            )
        })
        const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities')) || []
        Object.keys(account.meta.outputs).forEach((outputId) => {
            const output = account.meta.outputs?.[outputId]
            const claimed = !!account.meta.lockedOutputs[outputId]
            if (!output.remainder) {
                const hidden = hiddenActivities.includes(outputId)
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutput(outputId, output, address, hidden, claimed)
                )
            }
        })
    }
}
