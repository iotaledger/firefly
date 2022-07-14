import { IAccountState } from '@core/account'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { allAccountActivities, updateActivityByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    // TODO: find a way to determine if outgoing activities are claimed as well
    const activities = accountActivities.filter(
        (activity) => activity.direction === ActivityDirection.Out && activity.isAsync
    )

    for (const activity of activities) {
        try {
            const detailedOutput = await account.getOutput(activity.outputId)
            updateActivityByActivityId(account.id, activity.id, { isClaimed: isOutputClaimed(detailedOutput) })
        } catch (err) {
            // console.log(err)
        }
    }
}

function isOutputClaimed(output: OutputData): boolean {
    const expirationDate = getExpirationDateFromOutput(output.output)
    return (
        output.isSpent && output.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND < expirationDate.getTime()
    )
}
