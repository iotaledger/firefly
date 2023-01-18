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
    const currentVotingPower = getAmountFromOutput(output)
    const participations = parseGovernanceMetadata(metadata)

    const governanceInput = inputs?.find((input) => isParticipationOutput(input.output))
    if (governanceInput) {
        const oldMetadata = getMetadataFromOutput(governanceInput.output)
        const oldParticipations = parseGovernanceMetadata(oldMetadata)

        const addedParticipation = getParticipationDifference(oldParticipations, participations)
        const removedParticipation = getParticipationDifference(participations, oldParticipations)

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
        }

        const changedParticipation = getChangeParticipation(oldParticipations, participations)
        if (changedParticipation) {
            return {
                governanceAction: GovernanceAction.ChangedVote,
                votingPower: currentVotingPower,
                participation: changedParticipation,
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
