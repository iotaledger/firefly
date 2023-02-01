import { ProposalStatus } from '../enums'

export function isProposalVotable(status: string): boolean {
    switch (status) {
        case ProposalStatus.Commencing:
        case ProposalStatus.Holding:
            return true
        case ProposalStatus.Upcoming:
        case ProposalStatus.Ended:
        default:
            return false
    }
}
