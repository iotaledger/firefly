import { get } from 'svelte/store'

import { Event } from '@iota/wallet'

import { ProposalStatus } from '@core/governance/enums'
import { IProposal } from '@core/governance/interfaces'
import { nodeInfo } from '@core/network'
import { activeProfile } from '@core/profile'

export function createProposalsFromEvents(events: Event[]): IProposal[] {
    const proposals: IProposal[] = events.map(({ data, id }) => {
        const proposal = {
            id,
            title: data.name,
            status: ProposalStatus.Upcoming,
            milestones: {
                [ProposalStatus.Upcoming]: 0, // TODO: fix this
                [ProposalStatus.Commencing]: data.milestoneIndexCommence,
                [ProposalStatus.Holding]: data.milestoneIndexStart,
                [ProposalStatus.Ended]: data.milestoneIndexEnd,
            },
            // TODO: figure out a better way to get the node URLs
            nodeUrls: get(activeProfile)?.clientOptions?.nodes,
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
