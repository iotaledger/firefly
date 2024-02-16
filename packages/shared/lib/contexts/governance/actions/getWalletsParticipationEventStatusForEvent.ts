import type { ParticipationEventId, ParticipationEventStatus } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile'
import { getSelectedWallet } from '@core/wallet/stores/selected-wallet.store'

export function getWalletsParticipationEventStatusForEvent(
    eventId: ParticipationEventId,
    wallet: IWallet = getSelectedWallet()
): Promise<ParticipationEventStatus> {
    return wallet?.getParticipationEventStatus(eventId)
}
