import type { TrackedParticipation } from './types'
import { get } from 'svelte/store'
import { networkStatus } from '../networkStatus'

/**
 * Calculates votes by milestones range and voting power.
 * Every 1000 IOTA tokens (0,01 Miota) used to vote will create 1 vote every 10 seconds
 *
 * @method calculateVotesByMilestones
 *
 * @param {number} startMilestoneIndex
 * @param {number} endMilestoneIndex
 * @param {number} amount // IOTA
 *
 * @returns {number}
 */
export const calculateVotesByMilestones = (
    startMilestoneIndex: number,
    endMilestoneIndex: number,
    amount: number,
): number => {
    const _endMilestoneIndex = endMilestoneIndex || get(networkStatus)?.currentMilestone
    return amount * 0.001 * (_endMilestoneIndex - startMilestoneIndex)
}

/**
 * Calculates total votes by tracked participation milestone indexes and amount.
 *
 * @method calculateVotesByTrackedParticipation
 *
 * @param {TrackedParticipation} trackedParticipation
 *
 * @returns {number}
 */
export const calculateVotesByTrackedParticipation = (trackedParticipation: TrackedParticipation | null): number => {
    if (trackedParticipation) {
        return Object.values(trackedParticipation)?.reduce(
            (acc, val) =>
                acc + calculateVotesByMilestones(val?.startMilestoneIndex, val?.endMilestoneIndex, val?.amount),
            0
        )
    }
    return 0
}
