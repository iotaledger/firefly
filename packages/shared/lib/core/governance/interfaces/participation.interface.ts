import type { TrackedParticipationOverview } from '@iota/wallet'

export interface IParticipations {
    [eventId: string]: {
        [outputId: string]: TrackedParticipationOverview
    }
}
