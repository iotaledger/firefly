import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction } from '@core/wallet'
import { Activity, type AccountActivity } from '@core/wallet/types'
import { generateSingleAccountActivity } from './generateSingleAccountActivity'
import { AccountOutput, OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromAccountOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities: AccountActivity[] = []

    const accountOutputs = outputs.filter((output) => output.output.type === OutputType.Account)
    for (const accountOutput of accountOutputs) {
        const output = accountOutput.output as AccountOutput
        const activity = await generateSingleAccountActivity(wallet, {
            // TODO: Check if an account is created or minted and set the action accordingly
            action: output.accountId === EMPTY_HEX_ID ? ActivityAction.Send : ActivityAction.Mint,
            processedTransaction,
            wrappedOutput: accountOutput,
        })
        activities.push(activity)
    }
    return activities
}
