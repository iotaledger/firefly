import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'
import { logAndNotifyError } from '@core/error/actions/logAndNotifyError'

export function getVotingProposalState(eventId: ParticipationEventId): Promise<ParticipationEventStatus> {
    const account = get(selectedAccount)
    try {
        const status = account?.getParticipationEventStatus(eventId)
        return status
    } catch (err) {
        // TODO think about this
        logAndNotifyError(err)
        return undefined
    }
}
