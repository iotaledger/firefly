import { USE_LEDGER_SIMULATOR } from '@lib/ledger'
import { ProfileType } from '@core/profile/enums'
import { updateNewProfile } from '../stores'

/**
 * Set profile type if missing (for back compatibility purposes)
 * @method setNewProfileType
 * @param {ProfileType} type
 * @returns {void}
 */
export function setNewProfileType(type: ProfileType): void {
    type = USE_LEDGER_SIMULATOR ? ProfileType.Ledger : type
    updateNewProfile({ type })
}
