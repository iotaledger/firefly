import { IWalletState } from '@core/wallet/interfaces'
import { updateActivityFromPartialActivity } from '@core/wallet/utils/generateActivity/helper'
import { get } from 'svelte/store'
import { ActivityType } from '../../enums'
import { allWalletActivities } from '../../stores'

export function hideActivitiesForFoundries(wallet: IWalletState): void {
    const walletActivities = get(allWalletActivities)[wallet.id]

    const activities = walletActivities.filter((activity) => activity.type === ActivityType.Foundry)

    for (const activity of activities) {
        for (const candidate of walletActivities.filter(
            (_activity) => _activity?.transactionId === activity?.transactionId && _activity.id !== activity.id
        )) {
            updateActivityFromPartialActivity(candidate, { isHidden: true })
        }
    }
}
