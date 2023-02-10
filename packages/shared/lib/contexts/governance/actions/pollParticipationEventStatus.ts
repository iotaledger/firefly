import { PARTICIPATION_EVENT__STATUS_POLL_INTERVAL } from '../constants'
import { getAndSetSelectedParticipationEventStatus } from '../stores'

let pollInterval

export function pollParticipationEventStatus(eventId: string): void {
    void getAndSetSelectedParticipationEventStatus(eventId)
    pollInterval = setInterval(() => {
        void getAndSetSelectedParticipationEventStatus(eventId)
    }, PARTICIPATION_EVENT__STATUS_POLL_INTERVAL)
}

export function clearParticipationEventStatusPoll(): void {
    clearInterval(pollInterval)
}
