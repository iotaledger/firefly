import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityDirection } from '../enums'
import { allAccountActivities } from '../stores'

export function linkActivityAndClaimingTransaction(account: IAccountState): void {
    const accountActivities = get(allAccountActivities)[account.id]

    // TODO: find a way to determine if outgoing activities are claimed as well
    const activities = accountActivities.filter(
        (activity) => activity.direction === ActivityDirection.In && activity.isAsync
    )

    for (const activity of activities) {
        // TODO: add as many restrictions for candidates to optimize the time
        const candidates = accountActivities.filter((_activity) => _activity.time > activity.time)

        for (const candidate of candidates) {
            const isActivityInputOfCandidate = candidate.inputs.some(
                (input) => input.transactionId === activity.transactionId
            )

            if (isActivityInputOfCandidate) {
                updateClaimStatusAndHideClaimingActivity(activity, candidate, account.id)
                break
            }
        }
    }
}

function updateClaimStatusAndHideClaimingActivity(
    claimedActivity: Activity,
    claimingActivity: Activity,
    accountId: string
) {
    allAccountActivities.update((state) => {
        const _claimedActivity = state[accountId]?.find((_activity) => _activity.id === claimedActivity.id)
        const _claimingActivity = state[accountId]?.find(
            (_activity) => _activity.transactionId === claimingActivity.transactionId
        )

        _claimedActivity.updateFromPartialActivity({
            isClaimed: true,
            claimedDate: claimingActivity.time,
            claimingTransactionId: claimingActivity.transactionId,
        })
        _claimingActivity.updateFromPartialActivity({ isHidden: true })

        return state
    })
}
