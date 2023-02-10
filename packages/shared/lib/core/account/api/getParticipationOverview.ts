import type { ParticipationOverview } from '@iota/wallet'

import { getAccount } from '@core/profile-manager/api'

export async function getParticipationOverview(accountIndex: number): Promise<ParticipationOverview> {
    return (await getAccount(accountIndex))?.getParticipationOverview()
}
