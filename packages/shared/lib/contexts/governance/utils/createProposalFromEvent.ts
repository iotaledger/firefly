import { get } from 'svelte/store'
import type { ParticipationEventWithNodes } from '@iota/wallet/out/types'
import { OFFICIAL_NODE_URLS } from '@core/network/constants'
import { activeProfile, activeProfileId } from '@core/profile/stores'
import { proposalsState } from '../stores'
import { IProposal } from '../interfaces'
import { ProposalStatus, ProposalType } from '../enums'
import { getParticipationsForProposal } from './getParticipationsForProposal'
import { getLatestProposalStatus } from './getLatestProposalStatus'

export async function createProposalFromEvent(event: ParticipationEventWithNodes): Promise<IProposal> {
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

    const status = getLatestProposalStatus(milestones)

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
