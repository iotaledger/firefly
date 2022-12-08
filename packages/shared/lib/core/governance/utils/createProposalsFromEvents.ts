import { get } from 'svelte/store'

import { Event } from '@iota/wallet'

import { ProposalStatus } from '@core/governance/enums'
import { IProposal } from '@core/governance/interfaces'
import { nodeInfo } from '@core/network'

export function createProposalsFromEvents(events: Event[]): IProposal[] {
    const proposals: IProposal[] = events.map(({ data }) => {
        const proposal = {
            title: data.name,
            status: ProposalStatus.Announcement,
            milestones: {
                [ProposalStatus.Announcement]: 0, // TODO: fix this
                [ProposalStatus.VotingOpen]: data.milestoneIndexCommence,
                [ProposalStatus.Counting]: data.milestoneIndexStart,
                [ProposalStatus.Closed]: data.milestoneIndexEnd,
            },
        }

        const status = getLatestStatus(proposal)
        if (status) {
            proposal.status = status
        }
        return proposal
    })

    return proposals
}

function getLatestStatus(proposal: IProposal): ProposalStatus {
    const latestMilestoneIndex = get(nodeInfo)?.status?.latestMilestone.index
    const milestoneDifferences = Object.entries(proposal?.milestones).map(([status, milestone]) => ({
        status,
        milestoneDifference: latestMilestoneIndex - milestone,
    }))
    const passedMilestones = milestoneDifferences.filter(({ milestoneDifference }) => milestoneDifference > 0)
    const lastPassedMilestone = passedMilestones.pop()
    return <ProposalStatus>lastPassedMilestone?.status
}
