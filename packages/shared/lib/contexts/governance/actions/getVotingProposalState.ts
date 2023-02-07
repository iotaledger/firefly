import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'
import { IAccount } from '@core/account'

export async function getVotingProposalState(
    eventId: ParticipationEventId,
    account: IAccount = get(selectedAccount)
): Promise<ParticipationEventStatus> {
    try {
        const status = await account?.getParticipationEventStatus(eventId)
        return status
    } catch (err) {
        return undefined
    }
}
