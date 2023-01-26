import { get } from 'svelte/store'

import { Event } from '@iota/wallet'

import { ProposalStatus, ProposalType } from '@contexts/governance/enums'
import { IProposal } from '@contexts/governance/interfaces'
import { nodeInfo, OFFICIAL_NODE_URLS } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { getVotingEvents } from '@core/profile-manager'
import { getParticipationsForProposal, proposalsState } from '..'

export async function createProposals(): Promise<IProposal[]> {
    const events = await getVotingEvents()
    const proposals: IProposal[] = await Promise.all(events?.map(async (event) => createProposalFromEvent(event)))
    return proposals
}

async function createProposalFromEvent(event: Event): Promise<IProposal> {
    const { data, id } = event

    const officialNodeUrls = OFFICIAL_NODE_URLS[get(activeProfile).networkProtocol][get(activeProfile).networkType]
    const proposalNodeUrl = get(proposalsState)[get(activeProfileId)]?.[id].nodeUrl
    const isOfficialNetwork = officialNodeUrls.includes(proposalNodeUrl)

    const participated = (await getParticipationsForProposal(id)) !== undefined

    const milestones = {
        [ProposalStatus.Upcoming]: 0, // TODO: fix this
        [ProposalStatus.Commencing]: data.milestoneIndexCommence,
        [ProposalStatus.Holding]: data.milestoneIndexStart,
        [ProposalStatus.Ended]: data.milestoneIndexEnd,
    }

    const status = getLatestStatus(milestones)

    const proposal: IProposal = {
        id,
        title: event.data.name,
        additionalInfo: event.data.additionalInfo,
        status: status ?? ProposalStatus.Upcoming,
        milestones,
        // TODO: figure out a better way to get the node URLs
        nodeUrls: get(activeProfile)?.clientOptions?.nodes,
        type: isOfficialNetwork ? ProposalType.Official : ProposalType.Custom,
        participated,
    }

    return proposal
}

function getLatestStatus(milestones: Record<ProposalStatus, number>): ProposalStatus {
    const latestMilestoneIndex = get(nodeInfo)?.status?.latestMilestone.index
    const milestoneDifferences = Object.entries(milestones).map(([status, milestone]) => ({
        status,
        milestoneDifference: latestMilestoneIndex - milestone,
    }))
    const passedMilestones = milestoneDifferences.filter(({ milestoneDifference }) => milestoneDifference > 0)
    const lastPassedMilestone = passedMilestones.pop()
    return <ProposalStatus>lastPassedMilestone?.status
}
