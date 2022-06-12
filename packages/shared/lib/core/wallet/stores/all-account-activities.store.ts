import { get, writable } from 'svelte/store'
import { Activity } from '../classes'
import { InclusionState } from '../enums'
import { IAccountActivities } from '../interfaces'

export const allAccountActivities = writable<IAccountActivities[]>([])

export function addEmptyAccountActivitiesToAllAccountActivities(accountId: string): void {
    const accountActivities = get(allAccountActivities).find(
        (accountActivities) => accountActivities?.accountId === accountId
    )

    if (accountActivities) {
        accountActivities.activities = []
        replaceAccountActivitiesInAllAccountActivities(accountActivities)
    } else {
        allAccountActivities.update((state) => [...state, { accountId: accountId, activities: [] }])
    }
}

export function addActivityToAccountActivitiesInAllAccountActivities(accountId: string, activity: Activity): void {
    const accountActivities = get(allAccountActivities).find(
        (accountActivities) => accountActivities?.accountId === accountId
    )

    if (accountActivities.activities) {
        accountActivities.activities.push(activity)
    }

    replaceAccountActivitiesInAllAccountActivities(accountActivities)
}

export function replaceAccountActivitiesInAllAccountActivities(accountActivities: IAccountActivities): void {
    allAccountActivities.update((state) =>
        state.map((_accountActivities) =>
            _accountActivities.accountId === accountActivities.accountId ? accountActivities : _accountActivities
        )
    )
}

export function updateActivityInclusionStateByTransactionId(
    transactionId: string,
    inclusionState: InclusionState
): void {
    allAccountActivities.update((state) =>
        state.map((_accountActivities) => {
            const activity = _accountActivities.activities.find(
                (_activity) => _activity.transactionId === transactionId
            )

            if (activity) {
                activity.inclusionState = inclusionState
            }
            return _accountActivities
        })
    )
}
