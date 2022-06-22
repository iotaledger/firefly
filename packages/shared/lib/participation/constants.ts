import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The starting date of the next staking period.
 */
export const ASSEMBLY_EVENT_START_DATE = new Date('April 22, 2022')

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = '90ab02d8f700fcb3b31ff577416ecb105697a664738bec45b626920337a280e0'

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

export const STAKING_RESULT_URL: string =
    'https://raw.githubusercontent.com/iotaledger/participation-events/master/results/staking/'

export const BACKUP_STAKING_RESULT_URL: string = 'https://d36tzso9lqxl3c.cloudfront.net/results/staking/'

/**
 * The GitHub URLs containing the end Assembly staking results per period.
 */
export const ASSEMBLY_STAKING_RESULT_FILES: string[] = ['assembly_01.json']

/**
 * The GitHub URLs containing the end Shimmer staking result per period.
 */
export const SHIMMER_STAKING_RESULT_FILES: string[] = ['shimmer.json']

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_ASSEMBLY_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_ASSEMBLY_STAKING_PERIOD = 2

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_SHIMMER_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_SHIMMER_STAKING_PERIOD = 0
