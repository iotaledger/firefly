import type { ParticipationEventWithNodes } from '@iota/wallet'
import type { IAccountState } from '@core/account'

// TODO: check if we can remove this
export function getVotingEvents(account: IAccountState): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
    return account?.getParticipationEvents()
}
