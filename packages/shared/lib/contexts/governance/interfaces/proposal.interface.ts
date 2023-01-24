import { INode } from '@core/network'
import { ProposalStatus, ProposalType } from '../enums'
import { IOrganization } from './organization.interface'

export interface IProposal {
    id: string
    milestones?: Record<ProposalStatus, number>
    organization?: IOrganization
    status: ProposalStatus
    type: ProposalType
    title: string
    participated: boolean
    nodeUrls: INode[]
}
