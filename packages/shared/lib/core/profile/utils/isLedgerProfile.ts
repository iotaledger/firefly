import { ProfileType } from '@core/profile'

export function isLedgerProfile(profileType: ProfileType): boolean {
    return profileType === ProfileType.Ledger
}
