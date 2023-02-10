import { OrderOption } from '@core/utils/enums/filters'

import { PROPOSAL_PHASE_ORDERING } from '../constants'
import { ProposalOrderOption } from '../enums'
import { IProposal, IProposalFilter } from '../interfaces'

import { getNextProposalPhase } from './getNextProposalPhase'

export function sortProposals(proposals: IProposal[], filter: IProposalFilter): IProposal[] {
    let orderFunction = sortByPhaseAndMilestoneAndName
    let isAscending = true

    if (filter.order.active) {
        switch (filter.order.selected) {
            case ProposalOrderOption.Name:
                orderFunction = sortByName
                break
            case ProposalOrderOption.Phase:
                orderFunction = sortByPhaseAndMilestoneAndName
                break
        }
        isAscending = filter.order.ascDesc === OrderOption.Asc
    }

    return proposals?.sort((proposal1, proposal2) => orderFunction(proposal1, proposal2, isAscending)) ?? []
}

function sortByPhaseAndMilestoneAndName(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return (
        sortByPhase(proposal1, proposal2, asc) ||
        sortByMilestone(proposal1, proposal2, true) ||
        sortByName(proposal1, proposal2, true)
    )
}

function sortByName(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return proposal1.title.toLowerCase() > proposal2.title.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByPhase(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    if (PROPOSAL_PHASE_ORDERING[proposal1?.status] === PROPOSAL_PHASE_ORDERING[proposal2?.status]) {
        return 0
    } else if (PROPOSAL_PHASE_ORDERING[proposal1?.status] > PROPOSAL_PHASE_ORDERING[proposal2?.status]) {
        return asc ? 1 : -1
    } else {
        return asc ? -1 : 1
    }
}

function sortByMilestone(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    const proposal1Milestone = proposal1.milestones[getNextProposalPhase(proposal1?.status)]
    const proposal2Milestone = proposal2.milestones[getNextProposalPhase(proposal2?.status)]
    if (proposal1Milestone === proposal2Milestone) {
        return 0
    } else if (proposal1Milestone > proposal2Milestone) {
        return asc ? 1 : -1
    } else {
        return asc ? -1 : 1
    }
}
