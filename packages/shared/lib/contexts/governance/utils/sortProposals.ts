import { OrderOption } from '@core/utils/enums/filters'

import { PROPOSAL_PHASE_ORDERING } from '../constants'
import { ProposalOrderOption } from '../enums'
import { IProposal, IProposalFilter } from '../interfaces'

import { getNextProposalPhase } from './getNextProposalPhase'

export function sortProposals(proposals: IProposal[], filter: IProposalFilter): IProposal[] {
    let orderFunction = sortByPhaseAndSlotAndName
    let isAscending = true

    if (filter.order.active) {
        switch (filter.order.selected) {
            case ProposalOrderOption.Name:
                orderFunction = sortByName
                break
            case ProposalOrderOption.Phase:
                orderFunction = sortByPhaseAndSlotAndName
                break
        }
        isAscending = filter.order.ascDesc === OrderOption.Asc
    }

    return proposals?.sort((proposal1, proposal2) => orderFunction(proposal1, proposal2, isAscending)) ?? []
}

function sortByPhaseAndSlotAndName(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return (
        sortByPhase(proposal1, proposal2, asc) ||
        sortBySlot(proposal1, proposal2, true) ||
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

function sortBySlot(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    const proposal1Slot = proposal1?.slots?.[getNextProposalPhase(proposal1?.status)] ?? 0
    const proposal2Slot = proposal2?.slots?.[getNextProposalPhase(proposal2?.status)] ?? 0
    if (proposal1Slot === proposal2Slot) {
        return 0
    } else if (proposal1Slot > proposal2Slot) {
        return asc ? 1 : -1
    } else {
        return asc ? -1 : 1
    }
}
