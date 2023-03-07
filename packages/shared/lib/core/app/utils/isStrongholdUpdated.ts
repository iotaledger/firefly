import { IProfile } from '@core/profile/interfaces'
import { STRONGHOLD_VERSION } from '@core/stronghold/constants'
import features from '@features/features'

export function isStrongholdUpdated(profile: IProfile): boolean {
    return profile.strongholdVersion === STRONGHOLD_VERSION || !features.onboarding.strongholdVersionCheck.enabled
}
