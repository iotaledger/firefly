import { INode, ParticipationEventId, ParticipationEventType } from '@iota/sdk/out/types'
import { getSelectedWallet } from '@core/wallet'

export function getVotingParticipationEventIds(node: INode): Promise<ParticipationEventId[]> | undefined {
    return getSelectedWallet()?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
