import { ProposalStatus } from '../enums'

export function getNextProposalPhase(status: string): ProposalStatus {
    switch (status) {
        case ProposalStatus.Upcoming:
            return ProposalStatus.Commencing
        case ProposalStatus.Commencing:
            return ProposalStatus.Holding
        case ProposalStatus.Holding:
        case ProposalStatus.Ended:
            return ProposalStatus.Ended
    }
}
