import { ProposalStatus } from '../enums'

export type ProposalPhaseOrdering = {
    [key in ProposalStatus]: number
}
