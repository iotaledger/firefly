import { IProposal, IProposalFilter } from '../interfaces'
import { BooleanFilterOption } from '@core/utils/enums/filters'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export function isVisibleProposal(proposal: IProposal, filter: IProposalFilter): boolean {
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

function isVisibleWithActivePraticipatedFilter(proposal: IProposal, filter: IProposalFilter): boolean {
    const isParticipated = getParticipationsForProposal(proposal.id) !== undefined
    if (
        filter.participated.active &&
        ((filter.participated.selected === BooleanFilterOption.No && isParticipated) ||
            (filter.participated.selected === BooleanFilterOption.Yes && !isParticipated))
    ) {
        return false
    }
    return true
}

function isVisibleWithActiveTypeFilter(proposal: IProposal, filter: IProposalFilter): boolean {
    if (filter.type.active && filter.type.selected) {
        if (filter.type.selected !== proposal.type) {
            return false
        }
    }
    return true
}

function isVisibleWithActivePhaseFilter(proposal: IProposal, filter: IProposalFilter): boolean {
    if (filter.phase.active && filter.phase.selected) {
        if (filter.phase.selected !== proposal?.status) {
            return false
        }
    }
    return true
}
