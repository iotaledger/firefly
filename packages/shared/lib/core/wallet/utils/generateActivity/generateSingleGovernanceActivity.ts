import { IAccountState } from '@core/account'
import { IActivityGenerationParameters, IParticipation, IWrappedOutput } from '@core/wallet/interfaces'
import { GovernanceActivity, Output } from '@core/wallet/types'
import type { IBasicOutput } from '@iota/types'
import { ActivityType, GovernanceAction } from '../../enums'
import { activityOutputContainsValue, parseGovernanceMetadata } from '..'
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
    const governanceInfo = getGovernanceInfo(output, wrappedInputs, metadata)

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
    inputs: IWrappedOutput[],
    metadata: string
): {
    governanceAction: GovernanceAction
    votingPower: number
    votingPowerDifference?: number
    participation?: IParticipation
} {
    const currentVotingPower = getAmountFromOutput(output)
    const participations = parseGovernanceMetadata(metadata)

    const governanceInput = inputs?.find((input) => isParticipationOutput(input.output))
    if (governanceInput) {
        const oldMetadata = getMetadataFromOutput(governanceInput.output)
        const oldParticipations = parseGovernanceMetadata(oldMetadata)
        const { addedParticipation, removedParticipation } = getVotingDifferences(oldParticipations, participations)

        if (addedParticipation) {
            return {
                governanceAction: GovernanceAction.StartVoting,
                votingPower: currentVotingPower,
                participation: addedParticipation,
            }
        } else if (removedParticipation) {
            return {
                governanceAction: GovernanceAction.StopVoting,
                votingPower: currentVotingPower,
                participation: removedParticipation,
            }
        } else {
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
    }
    return {
        governanceAction: GovernanceAction.IncreaseVotingPower,
        votingPower: currentVotingPower,
        votingPowerDifference: currentVotingPower,
    }
}

function getVotingDifferences(
    oldParticipations: IParticipation[],
    newParticipations: IParticipation[]
): { removedParticipation: IParticipation; addedParticipation: IParticipation } {
    const removedParticipation = oldParticipations.find(
        (oldParticipation) =>
            !newParticipations.some((newParticipation) => newParticipation.eventId === oldParticipation.eventId)
    )
    const addedParticipation = newParticipations.find(
        (newParticipation) =>
            !oldParticipations.some((oldParticipation) => oldParticipation.eventId === newParticipation.eventId)
    )

    return { removedParticipation, addedParticipation }
}
