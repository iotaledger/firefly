import type { EventId, OutputId, TrackedParticipationOverview } from '@iota/wallet'

export interface IParticipations {
    [eventId: EventId]: {
        [outputId: OutputId]: TrackedParticipationOverview
    }
}
