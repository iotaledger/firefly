import { get, writable } from 'svelte/store'
import { Activity } from '../classes'
import { IAccountActivities } from '../interfaces'

export const allAccountActivities = writable<IAccountActivities[]>([])

export function addEmptyAccountActivitiesToAllAccountActivities(accountId: string): void {
    allAccountActivities.update((state) => [...state, { accountId: accountId, activities: [] }])
}

export function addActivityToAccountActivitiesInAllAccountActivities(accountId: string, activity: Activity): void {
    const accountActivities = get(allAccountActivities).find(
        (accountActivities) => accountActivities?.accountId === accountId
    )

    const { activities } = accountActivities
    activities ?? activities.push(activity)

    replaceAccountActivitiesInAllAccountActivities(accountActivities)
}

export function replaceAccountActivitiesInAllAccountActivities(accountActivities: IAccountActivities): void {
    allAccountActivities.update((state) =>
        state.map((_accountActivities) =>
            _accountActivities.accountId === accountActivities.accountId ? accountActivities : _accountActivities
        )
    )
}
