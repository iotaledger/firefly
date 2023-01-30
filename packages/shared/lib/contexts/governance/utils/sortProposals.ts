import { OrderOption } from '@core/utils/enums/filters'
import { PROPOSAL_PHASE_ORDERING } from '../constants'
import { ProposalOrderOption, ProposalStatus } from '../enums'
import { IProposal, IProposalFilter } from '../interfaces'

export function sortProposals(proposals: IProposal[], filter: IProposalFilter): IProposal[] {
    let orderFunction = sortByPhaseAndMilestone
    let isAscending = true

    if (filter.order.active) {
        switch (filter.order.selected) {
            case ProposalOrderOption.Name:
                orderFunction = sortByName
                break
            case ProposalOrderOption.Phase:
                orderFunction = sortByPhase
                break
        }
        isAscending = filter.order.ascDesc === OrderOption.Asc
    }

    return proposals?.sort((proposal1, proposal2) => orderFunction(proposal1, proposal2, isAscending)) ?? []
}

function sortByPhaseAndMilestone(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return sortByPhase(proposal1, proposal2, asc) || sortByMilestone(proposal1, proposal2, asc)
}

function sortByName(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return proposal1.title.toLowerCase() > proposal2.title.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByPhase(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return PROPOSAL_PHASE_ORDERING[proposal1.status] > PROPOSAL_PHASE_ORDERING[proposal2.status]
        ? asc
            ? 1
            : -1
        : asc
        ? -1
        : 1
}

function sortByMilestone(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    let proposal1Milestone: number
    let proposal2Milestone: number
    switch (proposal1.status) {
        case ProposalStatus.Upcoming:
            proposal1Milestone = proposal1.milestones.commencing
            proposal2Milestone = proposal2.milestones.commencing
            break
        case ProposalStatus.Commencing:
            proposal1Milestone = proposal1.milestones.holding
            proposal2Milestone = proposal2.milestones.holding
            break
        case ProposalStatus.Holding:
        case ProposalStatus.Ended:
            proposal1Milestone = proposal1.milestones.ended
            proposal2Milestone = proposal2.milestones.ended
            break
    }

    return proposal1Milestone > proposal2Milestone ? (asc ? 1 : -1) : asc ? -1 : 1
}
