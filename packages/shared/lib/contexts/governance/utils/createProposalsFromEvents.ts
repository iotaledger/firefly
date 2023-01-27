import { get } from 'svelte/store'

import { ProposalStatus, ProposalType } from '@contexts/governance/enums'
import { OFFICIAL_NODE_URLS } from '@core/network'
import { activeProfile, activeProfileId } from '@core/profile'
import { getParticipationsForProposal, IProposalMetadata, proposalStates } from '..'
import { ParticipationEvent } from '@iota/wallet'

export async function createProposalFromEvent(event: ParticipationEvent, nodeUrl: string): Promise<IProposalMetadata> {
    const { data, id } = event

    const officialNodeUrls = OFFICIAL_NODE_URLS[get(activeProfile).networkProtocol][get(activeProfile).networkType]
    const proposalNodeUrl = get(proposalStates)[get(activeProfileId)]?.[id].nodeUrl
    const isOfficialNetwork = officialNodeUrls.includes(proposalNodeUrl)

    const participated = (await getParticipationsForProposal(id)) !== undefined

    const milestones = {
        [ProposalStatus.Upcoming]: 0, // TODO: fix this
        [ProposalStatus.Commencing]: data.milestoneIndexCommence,
        [ProposalStatus.Holding]: data.milestoneIndexStart,
        [ProposalStatus.Ended]: data.milestoneIndexEnd,
    }

    const proposal: IProposalMetadata = {
        id,
        title: event.data.name,
        milestones,
        nodeUrl,
        type: isOfficialNetwork ? ProposalType.Official : ProposalType.Custom,
        participated,
    }

    return proposal
}
