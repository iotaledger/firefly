import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The starting date of the next staking period.
 */
export const ASSEMBLY_EVENT_START_DATE = new Date()

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = '54d85610d2d4077d9554c2ab30f41303cd7e8fb0afc2abf91c04a1ab451bd966'

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
 * The GitHub URLs containing the end Assembly staking results per period.
 */
export const ASSEMBLY_STAKING_RESULT_URLS: string[] = [
    'https://raw.githubusercontent.com/alexsporn/participation-events/master/results/staking/assembly_01.json',
]

/**
 * The GitHub URLs containing the end Shimmer staking result per period.
 */
export const SHIMMER_STAKING_RESULT_URLS: string[] = [
    'https://raw.githubusercontent.com/alexsporn/participation-events/master/results/staking/shimmer.json',
]

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
