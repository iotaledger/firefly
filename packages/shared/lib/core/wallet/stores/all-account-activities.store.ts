import { get, writable } from 'svelte/store'
import { Activity } from '../classes'
import { IAccountActivities } from '../interfaces'

export const allAccountActivities = writable<IAccountActivities[]>([])

export function addActivityToAccountActivities(accountId: string, activity: Activity): void {
    const accountActivities = get(allAccountActivities).find(
        (accountActivities) => accountActivities?.accountId === accountId
    )
    if (accountActivities.activities) {
        accountActivities.activities.push(activity)
    }
    replaceAccountActivities(accountActivities)
}

export function replaceAccountActivities(accountActivities: IAccountActivities): void {
    allAccountActivities.update((state) =>
        state.map((_accountActivities) =>
            _accountActivities.accountId === accountActivities.accountId ? accountActivities : _accountActivities
        )
    )
}
