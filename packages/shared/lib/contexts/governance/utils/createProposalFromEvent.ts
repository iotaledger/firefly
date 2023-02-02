import { get } from 'svelte/store'
import type { Node, ParticipationEventWithNodes, VotingEventPayload } from '@iota/wallet/out/types'
import { OFFICIAL_NODE_URLS } from '@core/network/constants'
import { activeProfile } from '@core/profile/stores'
import { IProposalMetadata } from '../interfaces'
import { ProposalStatus, ProposalType } from '../enums'
import { getParticipationsForProposal } from './getParticipationsForProposal'

export async function createProposalFromEvent(event: ParticipationEventWithNodes): Promise<IProposalMetadata> {
    const { data, id } = event

    const officialNodeUrls = OFFICIAL_NODE_URLS[get(activeProfile).networkProtocol][get(activeProfile).networkType]
    // TODO: fix this when @iota/wallet-rc.20 is released
    const nodeUrl = (event.nodes[0] as unknown as Node).url
    const isOfficialNetwork = officialNodeUrls.includes(nodeUrl)

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
        nodeUrl,
        questions: (data.payload as VotingEventPayload)?.questions,
        additionalInfo: data.additionalInfo,
        milestones,
        type: isOfficialNetwork ? ProposalType.Official : ProposalType.Custom,
        participated,
    }

    return proposal
}
