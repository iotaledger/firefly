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
    const inputs = processedTransaction.wrappedInputs
    const hasDelegationInput = inputs?.some((input) => input.output.type === OutputType.Delegation)
    const hasDelegationOutput = outputs.some((output) => output.output.type === OutputType.Delegation)

    if (hasDelegationOutput) {
        const delegationOutputs = outputs.filter((output) => output.output.type === OutputType.Delegation)
        for (const delegationOutput of delegationOutputs) {
            const activity = await generateSingleDelegationActivity(wallet, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: delegationOutput,
            })
            activities.push(activity)
        }
    } else if (hasDelegationInput) {
        const delegationInputs = inputs.filter((input) => input.output.type === OutputType.Delegation)
        for (const delegationInput of delegationInputs) {
            const activity = await generateSingleDelegationActivity(wallet, {
                action: ActivityAction.Claim,
                processedTransaction,
                wrappedOutput: delegationInput,
            })
            activities.push(activity)
        }
    }
    return activities
}
