import type { ParticipationOverview } from '@iota/wallet'

import { getAccount } from '@core/profile-manager/api'

export async function getParticipationOverview(index?: number): Promise<ParticipationOverview> {
    return (await getAccount(index))?.getParticipationOverview()
}
