import { selectedAccount } from '@core/account'
import { OutputTypes } from '@iota/types'
import { TransactionOptions } from '@iota/wallet'
import { isTransferring } from '@lib/wallet'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'
import { handleLedgerErrors } from '@core/ledger'

export async function sendOutput(output: OutputTypes): Promise<void> {
    try {
        isTransferring.set(true)
        const account = get(selectedAccount)
        const transactionOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        }
        const transaction = await account.sendOutputs([output], transactionOptions)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            await new Activity().setFromTransaction(transaction, account)
        )
        isTransferring.set(false)
        return
    } catch (err) {
        const _activeProfile = get(activeProfile)

        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerErrors(err.error)
        }

        isTransferring.set(false)
        throw err
    }
}
