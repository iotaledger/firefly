import { getAccount } from '@core/profile-manager'
import { ParticipationOverview } from '@iota/wallet'

export async function getParticipationOverview(index?: number): Promise<ParticipationOverview> {
    return (await getAccount(index))?.getParticipationOverview()
}
