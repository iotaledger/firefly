import { Node, ParticipationEventId, ParticipationEventType } from '@iota/sdk/out/types'
import { getSelectedWallet } from '@core/wallet'

export function getVotingParticipationEventIds(node: Node): Promise<ParticipationEventId[]> | undefined {
    return getSelectedWallet()?.getParticipationEventIds(node, ParticipationEventType.Voting)
}
