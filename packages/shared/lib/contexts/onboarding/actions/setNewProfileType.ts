import { ledgerSimulator } from '@lib/ledger'
import { ProfileType } from '@core/profile/enums'
import { updateNewProfile } from '../stores'

/**
 * Set profile type if missing (for back compatibility purposes)
 * @method setNewProfileType
 * @param {ProfileType} type
 * @returns {void}
 */
export function setNewProfileType(type: ProfileType): void {
    type = ledgerSimulator ? ProfileType.Ledger : type
    updateNewProfile({ type })
}
