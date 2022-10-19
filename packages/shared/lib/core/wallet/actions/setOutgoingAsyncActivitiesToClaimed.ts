import { IAccountState } from '@core/account'
import { IBasicOutput } from '@iota/types'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { get } from 'svelte/store'
import { ActivityDirection, ActivityType } from '../enums'
import { allAccountActivities, updateActivityByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setOutgoingAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter(
        (activity) =>
            activity.type === ActivityType.Transaction &&
            activity.direction === ActivityDirection.Outgoing &&
            activity.isAsync
    )

    for (const activity of activities) {
        try {
            if (activity.type === ActivityType.Transaction) {
                const detailedOutput = await account.getOutput(activity.outputId)
                const isClaimed = isOutputClaimed(detailedOutput)
                if (isClaimed) {
                    updateActivityByActivityId(account.index, activity.id, {
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
    const expirationDate = getExpirationDateFromOutput(output?.output as IBasicOutput)

    if (expirationDate) {
        return (
            output.isSpent &&
            output.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND < expirationDate.getTime()
        )
    } else {
        return output?.isSpent
    }
}
