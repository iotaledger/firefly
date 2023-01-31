import { get } from 'svelte/store'
import type { ParticipationEvent, VotingEventPayload } from '@iota/wallet'

import { ProposalStatus, ProposalType } from '@contexts/governance/enums'
import { OFFICIAL_NODE_URLS } from '@core/network'
import { activeProfile } from '@core/profile'
import { getParticipationsForProposal } from '../utils'
import { IProposalMetadata } from '../interfaces'

export async function createProposalFromEvent(event: ParticipationEvent, nodeUrl: string): Promise<IProposalMetadata> {
    const { data, id } = event

    const officialNodeUrls = OFFICIAL_NODE_URLS[get(activeProfile).networkProtocol][get(activeProfile).networkType]
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
        milestones,
        nodeUrl,
        questions: (data.payload as VotingEventPayload)?.questions,
        additionalInfo: data.additionalInfo,
        type: isOfficialNetwork ? ProposalType.Official : ProposalType.Custom,
        participated,
    }

    return proposal
}
