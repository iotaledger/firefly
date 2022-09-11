import { get } from 'svelte/store'

import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { Activity } from '@core/wallet/classes/activity.class'
import { ADDRESS_TYPE_ED25519 } from '@core/wallet/constants'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { Bech32Helper } from '@lib/bech32Helper'
import { Converter } from '@lib/converter'

import { validateWalletApiEvent } from '../../helpers'
import { INewOutputEvent } from '../../interfaces'

export function handleNewOutputEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleNewOutputEventInternal(accountIndex, payload as INewOutputEvent)
}

export function handleNewOutputEventInternal(accountIndex: number, payload: INewOutputEvent): void {
    const account = get(activeAccounts)?.find((account) => account.id === accountIndex.toString())
    const output = payload?.output

    const address =
        output?.address?.type === ADDRESS_TYPE_ED25519
            ? Bech32Helper.toBech32(0, Converter.hexToBytes(output?.address?.pubKeyHash?.substring(2)), 'rms')
            : ''
    if (output?.address?.type === ADDRESS_TYPE_ED25519 && account?.depositAddress === address && !output?.remainder) {
        syncBalance(account.id)

        const processedOutput = preprocessGroupedOutputs(
            [output],
            [payload?.transaction, payload?.transactionInputs],
            account
        )
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedOutput, account))
    }
}
