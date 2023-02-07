import { ProposalStatus } from '../enums'

export function isProposalActive(status: string): boolean {
    switch (status) {
        case ProposalStatus.Holding:
            return true
        case ProposalStatus.Commencing:
        case ProposalStatus.Upcoming:
        case ProposalStatus.Ended:
            return false
    }
}
