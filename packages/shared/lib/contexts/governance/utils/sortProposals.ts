import { OrderOption } from '@core/utils/enums/filters'
import { ProposalOrderOption, ProposalStatus } from '../enums'
import { IProposal, ProposalFilter } from '../interfaces'

export function sortProposals(proposals: IProposal[], filter: ProposalFilter): IProposal[] {
    let orderFunction = sortByName
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

function sortByName(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    return proposal1.title.toLowerCase() > proposal2.title.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByPhase(proposal1: IProposal, proposal2: IProposal, asc: boolean): number {
    const phaseOrdering = {
        [ProposalStatus.Upcoming]: 0,
        [ProposalStatus.Commencing]: 1,
        [ProposalStatus.Holding]: 2,
        [ProposalStatus.Ended]: 3,
    }
    return phaseOrdering[proposal1?.state?.status] > phaseOrdering[proposal2?.state?.status]
        ? asc
            ? 1
            : -1
        : asc
        ? -1
        : 1
}
