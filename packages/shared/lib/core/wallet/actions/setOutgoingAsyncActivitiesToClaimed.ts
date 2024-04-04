import { IWalletState } from '@core/wallet/interfaces'
import { BasicOutput, OutputMetadataResponse } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection } from '../enums'
import { allWalletActivities, updateAsyncDataByActivityId } from '../stores'
import { getExpirationDateFromOutput } from '../utils'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { getClient } from './getClient'

export async function setOutgoingAsyncActivitiesToClaimed(wallet: IWalletState): Promise<void> {
    const client = await getClient()
    const walletActivities = get(allWalletActivities)[wallet.id]

    const activities = walletActivities.filter(
        (activity) => activity.direction === ActivityDirection.Outgoing && activity.asyncData
    )

    for (const activity of activities) {
        try {
            let walletOutput = await wallet.getOutput(activity.outputId)
            let outputMetadata: OutputMetadataResponse
            if (walletOutput) {
                outputMetadata = walletOutput.metadata
            } else {
                walletOutput = await client.getOutput(activity.outputId)
                outputMetadata = await client.getOutputMetadata(activity.outputId)
            }
            const nodeProtocolParameters = get(nodeInfoProtocolParameters)
            if (nodeProtocolParameters && walletOutput.metadata.spent) {
                const claimedDate = new Date(
                    getUnixTimestampFromNodeInfoAndSlotIndex(
                        nodeProtocolParameters,
                        walletOutput.metadata.spent.slot
                    )
                )
                const isClaimed =
                    walletOutput.metadata &&
                    isOutputClaimed(walletOutput.output as BasicOutput, walletOutput.metadata, claimedDate)
                if (isClaimed && claimedDate) {
                    updateAsyncDataByActivityId(wallet.id, activity.id, {
                        asyncStatus: ActivityAsyncStatus.Claimed,
                        claimedDate,
                    })
                }
            }
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
