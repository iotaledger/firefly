import type { ParticipationEvent } from '@iota/wallet'
import { IAccountState } from '@core/account'

// TODO: check if we can remove this
export function getVotingEvents(account: IAccountState): Promise<ParticipationEvent[]> {
    return account?.getParticipationEvents()
}
