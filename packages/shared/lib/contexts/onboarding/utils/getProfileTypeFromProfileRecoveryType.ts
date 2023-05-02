import { ProfileType } from '@core/profile'
import { RestoreProfileType } from '@contexts/onboarding'

export function getProfileTypeFromProfileRecoveryType(restoreProfileType: RestoreProfileType): ProfileType {
    return restoreProfileType === RestoreProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
}
