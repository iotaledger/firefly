import type { ParticipationEventId, ParticipationEventStatus } from '@iota/sdk/out/types'
import { IWallet } from 'shared/lib/core/profile'
import { getSelectedWallet } from 'shared/lib/core/wallet/stores/selected-wallet.store'


export function getWalletsParticipationEventStatusForEvent(
    eventId: ParticipationEventId,
    account: IWallet = getSelectedWallet()
): Promise<ParticipationEventStatus> {
    return account?.getParticipationEventStatus(eventId)
}
