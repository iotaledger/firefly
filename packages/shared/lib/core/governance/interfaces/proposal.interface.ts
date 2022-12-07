import { ProposalStatus } from '../enums'
import { IOrganization } from './organization.interface'

export interface IProposal {
    organization?: IOrganization
    title: string
    status: ProposalStatus
    hasVoted?: boolean
    milestones?: Record<ProposalStatus, number>
}
