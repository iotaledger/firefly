import { syncBalance } from '@core/account/actions/syncBalance'
import { activeAccounts } from '@core/profile/stores'
import { convertEd25519ToBech32 } from '@core/wallet'
import { Activity } from '@core/wallet/classes/activity.class'
import { addActivityToAccountActivitiesInAllAccountActivities } from '@core/wallet/stores/all-account-activities.store'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { get } from 'svelte/store'
import { preprocessGroupedOutputs } from '@core/wallet/utils/outputs/preprocessGroupedOutputs'
import { WalletApiEvent } from '../../enums'
import { INewOutputEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleNewOutputEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.NewOutput)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleNewOutputEventInternal(accountIndex, payload as INewOutputEventPayload)
}

export function handleNewOutputEventInternal(accountIndex: number, payload: INewOutputEventPayload): void {
    const account = get(activeAccounts)?.find((account) => account.id === accountIndex.toString())
    const output = payload?.output

    const address =
        output?.address?.type === ADDRESS_TYPE_ED25519 ? convertEd25519ToBech32(output.address.pubKeyHash) : ''

    const isNewAliasOutput = output.output.type === OUTPUT_TYPE_ALIAS && output.output.stateIndex === 0

    if ((account.depositAddress === address && !output?.remainder) || isNewAliasOutput) {
        syncBalance(account.id)

        const processedOutput = preprocessGroupedOutputs(
            [output],
            [payload?.transaction, payload?.transactionInputs],
            account
        )[0]
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedOutput, account))
    }
}
