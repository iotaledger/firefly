import { get } from 'svelte/store'
import { networkStatus } from '@core/network/stores'
import { ProposalError, ProposalStatus } from '../enums'
import { IProposal, IProposalMetadata } from '../interfaces'
import { getProposalStatusForSlot } from './getProposalStatusForSlot'

export function createProposalFromError(
    proposal: IProposalMetadata,
    err: unknown | Record<string, unknown>
): IProposal {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
    if (isEventError) {
        const currentSlot = get(networkStatus)?.currentSlot
        if (!proposal.slots || !currentSlot) {
            return {
                ...proposal,
                status: '',
            }
        }
        const status = getProposalStatusForSlot(currentSlot, proposal.slots) ?? ''
        const isNodeOutdated = status !== ProposalStatus.Ended
        const error = isNodeOutdated ? ProposalError.NodeOutdated : ProposalError.ResultsNotAvailable
        return {
            ...proposal,
            status,
            error,
        }
    }

    return {
        ...proposal,
        status: '',
    }
}
