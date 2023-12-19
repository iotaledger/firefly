import { IWalletState } from '@core/wallet/interfaces'
import { BasicOutput, OutputData } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'
import { allWalletActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'

export async function setOutgoingAsyncActivitiesToClaimed(wallet: IWalletState): Promise<void> {
    const walletActivities = get(allWalletActivities)[wallet.id]

    const activities = walletActivities.filter(
        (activity) => activity.direction === ActivityDirection.Outgoing && activity.asyncData
    )

    for (const activity of activities) {
        try {
            const detailedOutput = await wallet.getOutput(activity.outputId)
            const isClaimed = detailedOutput && isOutputClaimed(detailedOutput)
            if (isClaimed) {
                updateAsyncDataByActivityId(wallet.id, activity.id, {
                    asyncStatus: ActivityAsyncStatus.Claimed,
                    claimedDate: new Date(), // TODO(2.0) Fix and use: new Date(detailedOutput.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND),
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function isOutputClaimed(output: OutputData): boolean {
    const expirationDate = getExpirationDateFromOutput(output?.output as BasicOutput)

    if (expirationDate) {
        return (
            output.isSpent &&
            new Date().getTime() /* TODO(2.0) Fix and use: output.metadata.milestoneTimestampSpent * MILLISECONDS_PER_SECOND */ <
                expirationDate.getTime()
        )
    } else {
        return output?.isSpent
    }
}
