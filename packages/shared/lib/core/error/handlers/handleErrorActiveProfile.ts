import { get } from 'svelte/store'
import { handleError } from '../handlers'
import { handleLedgerError } from '@core/ledger/utils'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { IError } from '@core/error/interfaces'

export function handleErrorActiveProfile(err: IError, governance = false): void {
    const _activeProfile = get(activeProfile)
    if (_activeProfile.type === ProfileType.Ledger) {
        handleLedgerError(err?.error, true, governance)
    } else {
        handleError(err)
    }
}
