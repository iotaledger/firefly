import type { ParticipationOverview } from '@iota/sdk/out/types'
import { getWallet } from '@core/profile/actions'

// TODO(2.0) Fix all usages
export async function getParticipationOverview(walletId: string, eventId?: string): Promise<ParticipationOverview> {
    return (await getWallet(walletId))?.getParticipationOverview(eventId ? [eventId] : undefined)
}
