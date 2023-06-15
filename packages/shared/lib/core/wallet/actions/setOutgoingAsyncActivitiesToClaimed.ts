import type { IAccountState } from '@core/account'
import type { IBasicOutput } from '@iota/types'
import type { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'
import { allAccountActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setOutgoingAsyncActivitiesToClaimed(account: IAccountState): Promise<void> {
    const accountActivities = get(allAccountActivities)[account.index]

    const activities = accountActivities.filter(
        (activity) => activity.direction === ActivityDirection.Outgoing && activity.asyncData
    )

    for (const activity of activities) {
        try {
            const detailedOutput = await account.getOutput(activity.outputId)
            const isClaimed = detailedOutput && isOutputClaimed(detailedOutput)
            if (isClaimed) {
                updateAsyncDataByActivityId(account.index, activity.id, {
                    asyncStatus: ActivityAsyncStatus.Claimed,
                    claimedDate: new Date(detailedOutput.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND),
                })
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
