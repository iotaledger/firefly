import { IWalletState } from '@core/wallet/interfaces'
import { updateActivityFromPartialActivity } from '@core/wallet/utils/generateActivity/helper'
import { get } from 'svelte/store'
import { ActivityType } from '../../enums'
import { allAccountActivities } from '../../stores'

export function hideActivitiesForFoundries(account: IWalletState): void {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter((activity) => activity.type === ActivityType.Foundry)

    for (const activity of activities) {
        for (const candidate of accountActivities.filter(
            (_activity) => _activity?.transactionId === activity?.transactionId && _activity.id !== activity.id
        )) {
            updateActivityFromPartialActivity(candidate, { isHidden: true })
        }
    }
}
