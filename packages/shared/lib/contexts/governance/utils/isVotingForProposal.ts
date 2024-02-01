import type { TrackedParticipationOverview } from '@iota/sdk/out/types'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export function isVotingForProposal(proposalId: string): boolean {
    const participations = getParticipationsForProposal(proposalId) ?? {}
    const participationOutputs: TrackedParticipationOverview[] = Object.values(participations)
    return participationOutputs.some((output) => output?.endMilestoneIndex === 0)
}
