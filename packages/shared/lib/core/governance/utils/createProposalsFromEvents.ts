import { ProposalStatus } from '@core/governance/enums'
import { IProposal } from '@core/governance/interfaces'
import { Event } from '@iota/wallet'

export function createProposalsFromEvents(events: Event[]): IProposal[] {
    const proposals: IProposal[] = events.map(({ data }) => ({
        title: data.name,
        status: ProposalStatus.Announcement,
        milestones: {
            [ProposalStatus.Announcement]: 0, // TODO: fix this
            [ProposalStatus.VotingOpen]: data.milestoneIndexCommence,
            [ProposalStatus.Counting]: data.milestoneIndexStart,
            [ProposalStatus.Closed]: data.milestoneIndexEnd,
        },
    }))

    return proposals
}
