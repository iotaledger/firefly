import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityDirection } from '../../enums'
import { addClaimedActivity, allAccountActivities, claimedActivities } from '../../stores'

export function linkActivityAndClaimingTransaction(account: IAccountState): void {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    const activities = accountActivities.filter(
        (activity) =>
            activity.data.type === 'transaction' &&
            activity.data.direction === ActivityDirection.In &&
            activity.data.isAsync
    )
    const claimedAccountActivities = get(claimedActivities)?.[account.id]

    for (const activity of activities) {
        const claimedActivity = claimedAccountActivities?.[activity.transactionId]
        if (claimedActivity && claimedActivity.claimingTransactionId === activity.transactionId) {
            updateClaimStatusAndHideClaimingActivity(
                activity.id,
                claimedActivity.transactionId,
                new Date(claimedActivity.claimedTimestamp),
                account.id
            )
            continue
        }

        // TODO: add as many restrictions for candidates to optimize the time
        const candidates = accountActivities.filter((_activity) => _activity.time > activity.time)
        for (const candidate of candidates) {
            const isActivityInputOfCandidate = candidate.inputs?.some(
                (input) => input.transactionId === activity.transactionId
            )

            if (isActivityInputOfCandidate) {
                updateClaimStatusAndHideClaimingActivity(
                    activity.id,
                    candidate.transactionId,
                    candidate.time,
                    account.id
                )
                addClaimedActivity(account.id, activity.id, {
                    id: activity.id,
                    claimedTimestamp: candidate.time.getTime(),
                    claimingTransactionId: candidate.transactionId,
                })
                break
            }
        }
    }
}

function updateClaimStatusAndHideClaimingActivity(
    claimedActivityId: string,
    claimingActivityTransactionId: string,
    claimingActivityTime: Date,
    accountId: string
) {
    allAccountActivities.update((state) => {
        const _claimedActivity = state[Number(accountId)]?.find((_activity) => _activity.id === claimedActivityId)
        const _claimingActivity = state[Number(accountId)]?.find(
            (_activity) => _activity.transactionId === claimingActivityTransactionId
        )

        _claimedActivity.updateDataFromPartialActivity({
            type: 'transaction',
            isClaimed: true,
            claimedDate: claimingActivityTime,
            claimingTransactionId: claimingActivityTransactionId,
        })
        _claimingActivity.updateFromPartialActivity({ isHidden: true })

        return state
    })
}
