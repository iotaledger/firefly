import { nodeInfo } from '@core/network/stores'
import { get } from 'svelte/store'
import { ProposalStatus } from '../enums'

export function getLatestProposalStatus(milestones: Record<ProposalStatus, number>): ProposalStatus {
    const latestMilestoneIndex = get(nodeInfo)?.status?.latestMilestone.index
    const milestoneDifferences = Object.entries(milestones).map(([status, milestone]) => ({
        status,
        milestoneDifference: latestMilestoneIndex - milestone,
    }))
    const passedMilestones = milestoneDifferences.filter(({ milestoneDifference }) => milestoneDifference > 0)
    const lastPassedMilestone = passedMilestones.pop()
    return <ProposalStatus>lastPassedMilestone?.status
}
