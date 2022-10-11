import { IAccountState } from '@core/account'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { get } from 'svelte/store'
import { ActivityDirection, ActivityType } from '../enums'
import { allAccountActivities, updateActivityDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setOutgoingAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter(
        (activity) =>
            activity.data.type === ActivityType.Transaction &&
            activity.data.direction === ActivityDirection.Outgoing &&
            activity.data.isAsync
    )

    for (const activity of activities) {
        try {
            if (activity.data.type === ActivityType.Transaction) {
                const detailedOutput = await account.getOutput(activity.data.outputId)
                const isClaimed = isOutputClaimed(detailedOutput)
                if (isClaimed) {
                    updateActivityDataByActivityId(account.index, activity.id, {
                        type: ActivityType.Transaction,
                        isClaimed: true,
                        claimedDate: new Date(
                            detailedOutput.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND
                        ),
                    })
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function isOutputClaimed(output: OutputData): boolean {
    const expirationDate = getExpirationDateFromOutput(output?.output)

    if (expirationDate) {
        return (
            output.isSpent &&
            output.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND < expirationDate.getTime()
        )
    } else {
        return output?.isSpent
    }
}
