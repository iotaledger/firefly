import { get } from 'svelte/store'

import { IAccount } from '@core/account/interfaces'
import { networkStatus } from '@core/network/stores'

import { ProposalErrorMode, ProposalStatus } from '../enums'
import { IProposal } from '../interfaces'
import { getProposalStatusForMilestone } from './getProposalStatusForMilestone'

export function createProposalFromError(
    proposal: IProposal,
    account: IAccount,
    err: unknown | Record<string, unknown>
): IProposal {
    const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
    if (isEventError) {
        const status = getProposalStatusForMilestone(get(networkStatus)?.currentMilestone, proposal.milestones)
        const isNodeOutdated = status !== ProposalStatus.Ended
        const errorMode = isNodeOutdated ? ProposalErrorMode.NodeOutdated : ProposalErrorMode.ResultsNotAvailable
        return {
            ...proposal,
            status,
            errorMode,
        }
    }
}
