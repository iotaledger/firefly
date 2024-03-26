import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, ActivityType, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { isParticipationOutput } from '@contexts/governance/utils'
import { generateSingleAccountActivity } from './generateSingleAccountActivity'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { generateSingleGovernanceActivity } from './generateSingleGovernanceActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { getActivityTypeFromOutput } from './helper'
import { generateActivitiesFromNftOutputs } from './generateActivitiesFromNftOutputs'
import { generateActivitiesFromAccountOutputs } from './generateActivitiesFromAccountOutputs'
import { generateActivitiesFromFoundryOutputs } from './generateActivitiesFromFoundryOutputs'
import { generateActivitiesFromBasicOutputs } from './generateActivitiesFromBasicOutputs'
import { OutputType } from '@iota/sdk/out/types'
import { generateVestingActivity } from './generateVestingActivity'
import { generateSingleAnchorActivity } from './generateSingleAnchorActivity'
import { generateActivitiesFromAnchorOutputs } from './generateActivitiesFromAnchorOutputs'

export async function generateActivities(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    if (processedTransaction.wrappedInputs?.length > 0) {
        return generateActivitiesFromProcessedTransactionsWithInputs(processedTransaction, wallet)
    } else {
        return generateActivitiesFromProcessedTransactionsWithoutInputs(processedTransaction, wallet)
    }
}

async function generateActivitiesFromProcessedTransactionsWithInputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const { outputs, wrappedInputs } = processedTransaction
    const activities: Activity[] = []

    const containsFoundryActivity = outputs.some((output) => output.output.type === OutputType.Foundry)
    if (containsFoundryActivity) {
        const foundryActivities = await generateActivitiesFromFoundryOutputs(processedTransaction, wallet)
        activities.push(...foundryActivities)
    }

    const containsNftActivity = outputs.some((output) => output.output.type === OutputType.Nft)
    if (containsNftActivity) {
        const nftActivities = await generateActivitiesFromNftOutputs(processedTransaction, wallet)
        activities.push(...nftActivities)
    }

    const containsAccountInInputs = wrappedInputs.some((input) => input.output.type === OutputType.Account)
    const containsAccountActivity =
        !containsAccountInInputs &&
        outputs.some((output) => output.output.type === OutputType.Account) &&
        !containsFoundryActivity
    if (containsAccountActivity) {
        const accountActivities = await generateActivitiesFromAccountOutputs(processedTransaction, wallet)
        activities.push(...accountActivities)
    }

    const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
    const governanceOutput = hasParticipationInputs
        ? processedTransaction?.outputs[0]
        : outputs.find((output) => isParticipationOutput(output.output))
    if (governanceOutput) {
        const governanceActivity = await generateSingleGovernanceActivity(wallet, {
            processedTransaction,
            wrappedOutput: governanceOutput,
            action: null,
        })
        activities.push(governanceActivity)
    }

    const containsAnchorActivity = outputs.some((output) => output.output.type === OutputType.Anchor)
    if (containsAnchorActivity) {
        const anchorActivities = await generateActivitiesFromAnchorOutputs(processedTransaction, wallet)
        activities.push(...anchorActivities)
    }
    if (!containsFoundryActivity && !containsNftActivity && !containsAccountActivity && !governanceOutput) {
        const basicActivities = await generateActivitiesFromBasicOutputs(processedTransaction, wallet)
        activities.push(...basicActivities)
    }

    return activities
}

/*
 * If we cannot get the detailed inputs for a transaction, we would need to blind guess what the user did with the transaction.
 * Therefore we set the action to `Unknown`
 */
async function generateActivitiesFromProcessedTransactionsWithoutInputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
    const activities = await Promise.all(
        nonRemainderOutputs.map(async (wrappedOutput) => {
            const params = {
                type: getActivityTypeFromOutput(wrappedOutput),
                action: ActivityAction.Unknown,
                processedTransaction,
                wrappedOutput,
            }
            switch (params.type) {
                case ActivityType.Basic:
                    return generateSingleBasicActivity(wallet, params)
                case ActivityType.Governance:
                    return generateSingleGovernanceActivity(wallet, params)
                case ActivityType.Foundry:
                    return generateSingleFoundryActivity(wallet, params)
                case ActivityType.Account:
                    return generateSingleAccountActivity(wallet, params)
                case ActivityType.Nft:
                    return generateSingleNftActivity(wallet, params)
                case ActivityType.Vesting:
                    return generateVestingActivity(wallet, params)
                case ActivityType.Anchor:
                    return generateSingleAnchorActivity(wallet, params)
                default:
                    throw new Error(`Unknown activity type: ${params.type}`)
            }
        })
    )
    return activities
}
