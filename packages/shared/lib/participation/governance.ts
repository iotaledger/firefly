import type { TrackedParticipation } from "./types";
import { get } from 'svelte/store'
import { networkStatus } from '../networkStatus'

/**
 * Calculates votes by milestones range and voting power.
 *
 * @method calculateVotesByMilestones
 *
 * @param {number} startMilestoneIndex
 * @param {number} endMilestoneIndex
 * @param {number} votingPower // IOTA
 *
 * @returns {number}
 */
export const calculateVotesByMilestones = (startMilestoneIndex: number, endMilestoneIndex: number, votingPower: number): number => {
    const _endMilestoneIndex = endMilestoneIndex || get(networkStatus)?.currentMilestone
    return (votingPower * 0.001) * (_endMilestoneIndex - startMilestoneIndex)
}

/**
 * Calculates the reward estimate for a particular staking airdrop.
 *
 * @method calculateVotesByTrackedParticipation
 *
 * @param {TrackedParticipation} trackedParticipation
 *
 * @returns {number}
 */
export const calculateVotesByTrackedParticipation = (trackedParticipation: TrackedParticipation | null): number => {
    if (trackedParticipation) {
        return Object.values(trackedParticipation)?.reduce((acc, val) => {
            return acc + calculateVotesByMilestones(val?.startMilestoneIndex, val?.endMilestoneIndex, val?.amount)
        }, 0)
    }
    return 0
}
