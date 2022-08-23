import { IAccountState } from '@core/account'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { TransactionActivityData } from '../interfaces'
import { allAccountActivities, updateActivityByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[Number(account.id)]

    const activities = accountActivities.filter(
        (activity) =>
            activity.data.type === 'transaction' &&
            activity.data.direction === ActivityDirection.Out &&
            activity.data.isAsync
    )

    for (const activity of activities) {
        try {
            const detailedOutput = await account.getOutput((activity.data as TransactionActivityData).outputId)
            const isClaimed = isOutputClaimed(detailedOutput)
            if (isClaimed) {
                updateActivityByActivityId(account.id, activity.id, {
                    isClaimed: true,
                    claimedDate: new Date(detailedOutput.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND),
                })
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
