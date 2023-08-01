import { get } from 'svelte/store'

import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet/out/types'

import { IAccount } from '@core/account/interfaces'
import { selectedAccount } from '@core/account/stores'

export function getAccountsParticipationEventStatusForEvent(
    eventId: ParticipationEventId,
    account: IAccount = get(selectedAccount)
): Promise<ParticipationEventStatus> {
    return account?.getParticipationEventStatus(eventId)
}
