import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { allAccountActivities } from '../stores'

export function updateActivityAsyncStateFromOutputs(account: IAccountState): void {
    Object.keys(account.meta.outputs).forEach((outputs) => {
        const output = account.meta.outputs?.[outputs]
    })
}
