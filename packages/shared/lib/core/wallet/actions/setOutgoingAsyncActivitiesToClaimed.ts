import { IWalletState } from '@core/wallet/interfaces'
import { BasicOutput, OutputMetadataResponse } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'
import { allWalletActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { getClient } from './getClient'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export async function setOutgoingAsyncActivitiesToClaimed(wallet: IWalletState): Promise<void> {
    const client = await getClient()
    const walletActivities = get(allWalletActivities)[wallet.id]

    const activities = walletActivities.filter(
        (activity) => activity.direction === ActivityDirection.Outgoing && activity.asyncData
    )

    for (const activity of activities) {
        try {
            const walletOutput = await wallet.getOutput(activity.outputId)

            let outputMetadata: OutputMetadataResponse
            let output: BasicOutput

            if (walletOutput) {
                outputMetadata = walletOutput.metadata
                output = walletOutput.output as BasicOutput
            } else {
                const clientOutput = await client.getOutput(activity.outputId)
                output = clientOutput.output as BasicOutput
                outputMetadata = await client.getOutputMetadata(activity.outputId)
            }

            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (nodeProtocolParameters && outputMetadata.spent) {
                const claimedDate = new Date(
                    getUnixTimestampFromNodeInfoAndSlotIndex(nodeProtocolParameters, outputMetadata.spent.slot) *
                        MILLISECONDS_PER_SECOND
                )
                const isClaimed = outputMetadata && isOutputClaimed(output, outputMetadata, claimedDate)
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

function isOutputClaimed(output: BasicOutput, metadata: OutputMetadataResponse, claimedDate: Date): boolean {
    const expirationDate = getExpirationDateFromOutput(output)
    if (expirationDate) {
        return !!metadata.spent && claimedDate.getTime() < expirationDate.getTime()
    } else {
        return !!metadata.spent
    }
}
