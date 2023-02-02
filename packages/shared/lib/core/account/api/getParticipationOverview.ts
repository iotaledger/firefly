import type { ParticipationOverview } from '@iota/wallet'
import type { IAccountState } from '@core/account/interfaces'

export function getParticipationOverview(account: IAccountState): Promise<ParticipationOverview> {
    return account.getParticipationOverview()
}
