import { IPersistedProfile } from '@core/profile/interfaces'
import { STRONGHOLD_VERSION } from '@core/stronghold/constants'

export function isStrongholdUpdated(profile: IPersistedProfile): boolean {
    return profile.strongholdVersion === STRONGHOLD_VERSION
}
