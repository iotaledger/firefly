import type { ParticipationEventId, ParticipationEventWithNodes } from '@iota/sdk/out/types'
import { getSelectedWallet } from '@core/wallet'

export function getVotingEvent(eventId: ParticipationEventId): Promise<ParticipationEventWithNodes> {
    const wallet = getSelectedWallet()
    return wallet.getParticipationEvent(eventId)
}
