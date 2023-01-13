import type { ParticipationOverview } from '@iota/wallet'

import { DEFAULT_PARTICIPATION_OVERVIEW } from '@contexts/governance/constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getParticipationOverview(index?: number): ParticipationOverview {
    return DEFAULT_PARTICIPATION_OVERVIEW
}
