import { IAccountState } from '@core/account'
import { IActivityGenerationParameters, IWrappedOutput } from '@core/wallet/interfaces'
import { GovernanceActivity, Output } from '@core/wallet/types'
import type { IBasicOutput } from '@iota/types'
import { ActivityType, GovernanceAction } from '../../enums'
import { activityOutputContainsValue } from '..'
import {
    getAmountFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { isParticipationOutput } from '@contexts/governance'

export function generateSingleGovernanceActivity(
    account: IAccountState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): GovernanceActivity {
    const { transactionId, direction, time, inclusionState, wrappedInputs } = processedTransaction

    const isHidden = false
    const isAssetHidden = false
    const containsValue = activityOutputContainsValue(wrappedOutput)

    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const output = wrappedOutput.output as IBasicOutput

    const tag = getTagFromOutput(output)
    const metadata = getMetadataFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)

    const { storageDeposit } = getStorageDepositFromOutput(output)
    const votingPower = getAmountFromOutput(output)
    const governanceInfo = getGovernanceInfo(output, wrappedInputs)

    return {
        type: ActivityType.Governance,
        isHidden,
        id,
        transactionId,
        time,
        direction,
        action,
        isAssetHidden,
        inclusionState,
        containsValue,
        outputId,
        storageDeposit,
        giftedStorageDeposit: 0,
        votingPower,
        metadata,
        tag,
        asyncData: null,
        ...governanceInfo,
        ...sendingInfo,
    }
}

function getGovernanceInfo(
    output: Output,
    inputs: IWrappedOutput[]
): {
    governanceAction: GovernanceAction
    votingPower: number
    votingPowerDifference?: number
} {
    const currentVotingPower = getAmountFromOutput(output)
    const governanceInput = inputs?.find((input) => isParticipationOutput(input.output))
    if (governanceInput) {
        const oldVotingPower = getAmountFromOutput(governanceInput.output)
        return {
            governanceAction:
                currentVotingPower - oldVotingPower > 0
                    ? GovernanceAction.IncreaseVotingPower
                    : GovernanceAction.DecreaseVotingPower,
            votingPower: currentVotingPower,
            votingPowerDifference: Math.abs(currentVotingPower - oldVotingPower),
        }
    }
    return {
        governanceAction: GovernanceAction.IncreaseVotingPower,
        votingPower: currentVotingPower,
    }
}
