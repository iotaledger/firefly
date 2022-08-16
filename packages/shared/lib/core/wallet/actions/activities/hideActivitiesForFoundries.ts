import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityType } from '../../enums'
import { allAccountActivities } from '../../stores'

export function hideActivitiesForFoundries(account: IAccountState): void {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    const activities = accountActivities.filter((activity) => activity.type === ActivityType.Minting)

    for (const activity of activities) {
        for (const candidate of accountActivities.filter(
            (_activity) => _activity.transactionId === activity.transactionId && _activity.id !== activity.id
        )) {
            candidate.updateFromPartialActivity({ isHidden: true })
        }
    }
}
