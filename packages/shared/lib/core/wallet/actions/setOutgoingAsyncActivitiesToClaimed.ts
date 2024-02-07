import { IWalletState } from '@core/wallet/interfaces'
import { BasicOutput, OutputData } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'
import { allWalletActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '../../network'

export async function setOutgoingAsyncActivitiesToClaimed(wallet: IWalletState): Promise<void> {
    const walletActivities = get(allWalletActivities)[wallet.id]

    const activities = walletActivities.filter(
        (activity) => activity.direction === ActivityDirection.Outgoing && activity.asyncData
    )

    for (const activity of activities) {
        try {
            const detailedOutput = await wallet.getOutput(activity.outputId)
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (nodeProtocolParameters && detailedOutput.metadata.spent) {
                const claimedDate = new Date(
                    getUnixTimestampFromNodeInfoAndSlotIndex(nodeProtocolParameters, detailedOutput.metadata.spent.slot)
                )
                const isClaimed = detailedOutput && isOutputClaimed(detailedOutput, claimedDate)
                if (isClaimed && claimedDate) {
                    updateAsyncDataByActivityId(wallet.id, activity.id, {
                        asyncStatus: ActivityAsyncStatus.Claimed,
                        claimedDate,
                    })
                }
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function isOutputClaimed(output: OutputData, claimedDate: Date): boolean {
    const expirationDate = getExpirationDateFromOutput(output?.output as BasicOutput)
    if (expirationDate) {
        return !!output.metadata.spent && claimedDate.getTime() < expirationDate.getTime()
    } else {
        return !!output?.metadata.spent
    }
}
