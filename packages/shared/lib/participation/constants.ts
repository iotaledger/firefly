import { MILLISECONDS_PER_SECOND } from '@core/utils/time'

import { Participation, StakingAirdrop } from './types'

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = '57607d9f8cefc366c3ead71f5b1d76cef1b36a07eb775158c541107951d4aecb'

/**
 * The staking event ID for Shimmer.
 */
export const SHIMMER_EVENT_ID = 'f6dbdad416e0470042d3fe429eb0e91683ba171279bce01be6d1d35a9909a981'

/**
 * Useful array of staking event IDs.
 */
export const STAKING_EVENT_IDS: string[] = [ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID]

/**
 * The array of staking participations to use for the API.
 */
export const STAKING_PARTICIPATIONS: Participation[] = [
    {
        eventId: SHIMMER_EVENT_ID,
        answers: [],
    },
    {
        eventId: ASSEMBLY_EVENT_ID,
        answers: [],
    },
]

/**
 * The different ticker symbols for Assembly and Shimmer.
 */
export const STAKING_AIRDROP_TOKENS: { [key in StakingAirdrop]: string } = {
    [StakingAirdrop.Assembly]: 'ASMB',
    [StakingAirdrop.Shimmer]: 'SMR',
}

/**
 * The duration (milliseconds) to wait in between polling for new
 * participation information.
 */
export const PARTICIPATION_POLL_DURATION = 10 * MILLISECONDS_PER_SECOND
