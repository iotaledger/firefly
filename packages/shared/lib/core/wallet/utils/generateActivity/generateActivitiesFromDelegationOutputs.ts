import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, DelegationActivity, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleDelegationActivity } from './generateSingleDelegationActivity'
import { OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromDelegationOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities: DelegationActivity[] = []

    const delegationOutputs = outputs.filter((output) => output.output.type === OutputType.Delegation)
    // console.log('delegationOutputs________', delegationOutputs)
    for (const delegationOutput of delegationOutputs) {
        const activity = await generateSingleDelegationActivity(wallet, {
            action: ActivityAction.Create,
            processedTransaction,
            wrappedOutput: delegationOutput,
        })
        activities.push(activity)
        // console.log('generateActivitiesFromDelegationOutputs ACTIVITY:', activity)
    }
    return activities
}
