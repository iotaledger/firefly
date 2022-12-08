import { ProposalStatus } from '../enums'
import { IOrganization } from './organization.interface'

export interface IProposal {
    hasVoted?: boolean
    id: string
    milestones?: Record<ProposalStatus, number>
    organization?: IOrganization
    status: ProposalStatus
    title: string
}
