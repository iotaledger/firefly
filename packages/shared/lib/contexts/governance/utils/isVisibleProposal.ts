import { IProposal, ProposalFilter } from '../interfaces'
import { BooleanFilterOption } from '@core/utils/enums/filters'

export function isVisibleProposal(proposal: IProposal, filter: ProposalFilter): boolean {
    if (!isVisibleWithActivePhaseFilter(proposal, filter)) {
        return false
    }
    if (!isVisibleWithActiveTypeFilter(proposal, filter)) {
        return false
    }
    if (!isVisibleWithActivePraticipatedFilter(proposal, filter)) {
        return false
    }
    return true
}

function isVisibleWithActivePraticipatedFilter(proposal: IProposal, filter: ProposalFilter): boolean {
    if (
        filter.participated.active &&
        ((filter.participated.selected === BooleanFilterOption.No && proposal.participated) ||
            (filter.participated.selected === BooleanFilterOption.Yes && !proposal.participated))
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveTypeFilter(proposal: IProposal, filter: ProposalFilter): boolean {
    if (filter.type.active && filter.type.selected) {
        if (filter.type.selected !== proposal.type) {
            return false
        }
    }
    return true
}

function isVisibleWithActivePhaseFilter(proposal: IProposal, filter: ProposalFilter): boolean {
    if (filter.phase.active && filter.phase.selected) {
        if (filter.phase.selected !== proposal.status) {
            return false
        }
    }
    return true
}
