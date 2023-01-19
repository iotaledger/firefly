import { isParticipationOutput } from '@contexts/governance'
import { GovernanceAction } from '@core/wallet/enums'
import { IParticipation, IWrappedOutput } from '@core/wallet/interfaces'
import { Output } from '@core/wallet/types'
import { parseGovernanceMetadata } from '../../parseGovernanceMetadata'
import { getAmountFromOutput } from './getAmountFromOutput'
import { getMetadataFromOutput } from './getMetadataFromOutput'

interface IGovernanceInfo {
    governanceAction: GovernanceAction
    votingPower: number
    votingPowerDifference?: number
    participation?: IParticipation
}

export function getGovernanceInfo(output: Output, inputs: IWrappedOutput[], metadata: string): IGovernanceInfo {
    /**
     * NOTE: If the output is NOT a participation output, then it doesn't have any voting power.
     * This is possible if the user manually set it to zero, which automatically removes the
     * participation metadata and tag.
     */
    const currentVotingPower = isParticipationOutput(output) ? getAmountFromOutput(output) : 0
    const participations = parseGovernanceMetadata(metadata)

    const governanceInput = inputs?.find((input) => isParticipationOutput(input.output))
    if (governanceInput) {
        const oldMetadata = getMetadataFromOutput(governanceInput.output)
        const oldParticipations = parseGovernanceMetadata(oldMetadata)
        const oldVotingPower = getAmountFromOutput(governanceInput.output)

        const addedParticipation = getParticipationDifference(oldParticipations, participations)
        const removedParticipation = getParticipationDifference(participations, oldParticipations)

        if (addedParticipation) {
            return {
                governanceAction: GovernanceAction.StartVoting,
                votingPower: currentVotingPower,
                participation: addedParticipation,
            }
        } else if (removedParticipation) {
            /**
             * NOTE: Unless we check the voting power, we won't know if the participations were removed
             * because the user stopped voting or manually set the voting power to zero.
             */
            if (currentVotingPower === 0) {
                return {
                    governanceAction: GovernanceAction.DecreaseVotingPower,
                    votingPower: currentVotingPower,
                    votingPowerDifference: oldVotingPower,
                }
            } else {
                return {
                    governanceAction: GovernanceAction.StopVoting,
                    votingPower: currentVotingPower,
                    participation: removedParticipation,
                }
            }
        }

        const changedParticipation = getChangeParticipation(oldParticipations, participations)
        if (changedParticipation) {
            return {
                governanceAction: GovernanceAction.ChangedVote,
                votingPower: currentVotingPower,
                participation: changedParticipation,
            }
        } else {
            return {
                governanceAction:
                    currentVotingPower - oldVotingPower > 0
                        ? GovernanceAction.IncreaseVotingPower
                        : GovernanceAction.DecreaseVotingPower,
                votingPower: currentVotingPower,
                votingPowerDifference: Math.abs(currentVotingPower - oldVotingPower),
            }
        }
    } else {
        // There is no governance input when the user first adds voting power
        return {
            governanceAction: GovernanceAction.IncreaseVotingPower,
            votingPower: currentVotingPower,
            votingPowerDifference: currentVotingPower,
        }
    }
}

function getParticipationDifference(
    oldParticipations: IParticipation[],
    newParticipations: IParticipation[]
): IParticipation {
    const participationDifference = newParticipations.find(
        (newParticipation) =>
            !oldParticipations.some((oldParticipation) => newParticipation.eventId === oldParticipation.eventId)
    )
    return participationDifference
}

function getChangeParticipation(
    oldParticipations: IParticipation[],
    newParticipations: IParticipation[]
): IParticipation {
    return newParticipations.find((newParticipation) =>
        oldParticipations.some(
            (oldParticipation) =>
                oldParticipation.eventId === newParticipation.eventId && JSON.stringify(newParticipation.answers)
        )
    )
}
