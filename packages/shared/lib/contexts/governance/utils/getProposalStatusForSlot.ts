import { ProposalStatus } from '../enums'

export function getProposalStatusForSlot(
    slot: number,
    slots: Record<ProposalStatus, number>
): ProposalStatus | undefined {
    if (!slot || !slots) {
        return undefined
    } else if (slot >= slots[ProposalStatus.Ended]) {
        return ProposalStatus.Ended
    } else if (slot >= slots[ProposalStatus.Holding]) {
        return ProposalStatus.Holding
    } else if (slot >= slots[ProposalStatus.Commencing]) {
        return ProposalStatus.Commencing
    } else if (slot >= slots[ProposalStatus.Upcoming]) {
        return ProposalStatus.Upcoming
    }
}
