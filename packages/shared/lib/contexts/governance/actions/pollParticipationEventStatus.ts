import { PARTICIPATION_EVENT__STATUS_POLL_INTERVAL } from '../constants'
import { getAndSetSelectedParticipationEventStatus } from '../stores'

let pollInterval: number

export async function pollParticipationEventStatus(eventId: string): Promise<void> {
    await getAndSetSelectedParticipationEventStatus(eventId)
    pollInterval = window.setInterval(() => {
        void getAndSetSelectedParticipationEventStatus(eventId)
    }, PARTICIPATION_EVENT__STATUS_POLL_INTERVAL)
}

export function clearParticipationEventStatusPoll(): void {
    clearInterval(pollInterval)
}
