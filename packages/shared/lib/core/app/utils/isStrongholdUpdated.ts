import { STRONGHOLD_VERSION } from '@core/stronghold/constants'
import { StrongholdVersion } from '@core/stronghold/enums'

export function isStrongholdUpdated(strongholdVersion: StrongholdVersion): boolean {
    return strongholdVersion === STRONGHOLD_VERSION
}
