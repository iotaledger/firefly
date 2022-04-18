import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The starting date of the next staking period.
 */
export const ASSEMBLY_EVENT_START_DATE = new Date('April 19, 2022')

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
export const STAKING_EVENT_IDS = [ASSEMBLY_EVENT_ID, SHIMMER_EVENT_ID]

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

export const TREASURY_VOTE_EVENT_ID = '16d2eb8aada8bff94d98bd0cb59b33e8e8fde97b09b4712876c4a80523e24d43'

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

/**
 * The amount of microASMB per 1 Mi received every milestone,
 * which is currently 4 microASMB (0.000004 ASMB).
 */
export const ASSEMBLY_REWARD_MULTIPLIER = 4.0

/**
 * The amount of SMR per 1 Mi received every milestone,
 * which is currently 1 SMR.
 */
export const SHIMMER_REWARD_MULTIPLIER = 1.0
