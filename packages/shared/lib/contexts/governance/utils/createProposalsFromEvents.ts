import { get } from 'svelte/store'

import { Event } from '@iota/wallet'

import { ProposalStatus } from '@contexts/governance/enums'
import { IProposal } from '@contexts/governance/interfaces'
import { nodeInfo } from '@core/network'
import { activeProfile } from '@core/profile'
import { getVotingEvents } from '@core/profile-manager'

export async function createProposals(): Promise<IProposal[]> {
    const events = await getVotingEvents()
    const proposals: IProposal[] = events?.map(createProposalFromEvent)
    return proposals
}

export function createProposalFromEvent(event: Event): IProposal {
    const { data, id } = event
    const proposal = {
        id,
        title: event.data.name,
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
