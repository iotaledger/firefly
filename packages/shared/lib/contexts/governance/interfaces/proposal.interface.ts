import { INode } from '@core/network'
import { ProposalStatus } from '../enums'
import { IOrganization } from './organization.interface'

export interface IProposal {
    id: string
    milestones?: Record<ProposalStatus, number>
    organization?: IOrganization
    status: ProposalStatus
    title: string
    additionalInfo: string
    nodeUrls: INode[]
}
