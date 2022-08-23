import { ProfileType } from '@core/profile'
import { ProfileRecoveryType } from '@contexts/onboarding'

export function getProfileTypeFromProfileRecoveryType(recoveryType: ProfileRecoveryType): ProfileType {
    return recoveryType === ProfileRecoveryType.Ledger ? ProfileType.Ledger : ProfileType.Software
}
