import { MILLISECONDS_PER_SECOND } from '../time'

import { Participation, StakingAirdrop } from './types'

/**
 * The staking event ID for Assembly.
 */
export const ASSEMBLY_EVENT_ID = 'da9b089c70b22af82658d7eb74dd585d2f68f62915373e2794992079d1ef780c'

/**
 * The staking event ID for Shimmer.
 */
export const SHIMMER_EVENT_ID = 'ae6acd37c2176384be7ebc3b094eaa2dcb07958fed84bc0c2de2ffaf41bb19cf '

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
