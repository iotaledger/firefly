import { writable } from 'svelte/store'
import { ProposalStatus } from '../../../../components/enums'
import { Icon as IconEnum } from '@auxiliary/icon'

type DAO = {
    name: string
    icon: IconEnum
}

type Proposal = {
    dao?: DAO
    title: string
    status: ProposalStatus
    hasVoted?: boolean
    milestones?: Record<ProposalStatus, number>
}

export const selectedProposal = writable<Proposal>(null)
