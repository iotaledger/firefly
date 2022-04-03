import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = '249dfc25efde867884ff083e35f8df4e32bd0abb40862b6304203a27f0e1e5d0'

/**
 * The staking event ID for Shimmer.
 */
export const SHIMMER_EVENT_ID = '24a2e624d3416a323a542b0c5c715783dd125b0f3fd51f6cceda0707806726ae'

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
    'https://raw.githubusercontent.com/iotaledger/participation-events/b6d04e17de570aa5b633ee18b1087b2f9bd48601/results/staking/assembly_01.json',
    'https://raw.githubusercontent.com/iotaledger/participation-events/b6d04e17de570aa5b633ee18b1087b2f9bd48601/results/staking/assembly_01.json',
    'https://raw.githubusercontent.com/iotaledger/participation-events/b6d04e17de570aa5b633ee18b1087b2f9bd48601/results/staking/assembly_01.json',
]

/**
 * The GitHub URLs containing the end Shimmer staking result per period.
 */
export const SHIMMER_STAKING_RESULT_URLS: string[] = [
    'https://raw.githubusercontent.com/iotaledger/participation-events/886597c7372c406ef6a8bc4df165619da0d82af4/results/staking/shimmer.json',
]

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_ASSEMBLY_STAKING_PERIOD = 3

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_ASSEMBLY_STAKING_PERIOD = 3

/**
 * The number of the last completed Assembly staking period.
 */
export const LAST_SHIMMER_STAKING_PERIOD = 1

/**
 * The number of the last completed Assembly staking period.
 * Set to 0 if no current event
 */
export const CURRENT_SHIMMER_STAKING_PERIOD = 1
