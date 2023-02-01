import { ProposalStatus } from '../enums'
import { ProposalPhaseOrdering } from '../types'

export const PROPOSAL_PHASE_ORDERING: ProposalPhaseOrdering = {
    [ProposalStatus.Upcoming]: 0,
    [ProposalStatus.Commencing]: 1,
    [ProposalStatus.Holding]: 2,
    [ProposalStatus.Ended]: 3,
}
