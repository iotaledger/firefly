import { ProposalStatus } from '../enums'

export function getProposalStatusForMilestone(
    milestone: number,
    milestones: Record<ProposalStatus, number>
): ProposalStatus {
    if (!milestone || !milestones) {
        return undefined
    } else if (milestone >= milestones[ProposalStatus.Ended]) {
        return ProposalStatus.Ended
    } else if (milestone >= milestones[ProposalStatus.Holding]) {
        return ProposalStatus.Holding
    } else if (milestone >= milestones[ProposalStatus.Commencing]) {
        return ProposalStatus.Commencing
    } else if (milestone >= milestones[ProposalStatus.Upcoming]) {
        return ProposalStatus.Upcoming
    }
}
