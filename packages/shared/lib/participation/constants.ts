import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = '249dfc25efde867884ff083e35f8df4e32bd0abb40862b6304203a27f0e1e5d0'

/**
 * The staking event ID for Shimmer.
 */
export const SHIMMER_EVENT_ID = ''

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

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_ASSEMBLY_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_ASSEMBLY_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_SHIMMER_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_SHIMMER_STAKING_PERIOD = 1
