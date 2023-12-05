import { localize } from '@core/i18n'
import { getTrimmedLength, validateFilenameChars } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_PROFILE_NAME_LENGTH } from '../constants'
import { profiles } from '../stores'

/**
 * Validates the trimmed profile name
 * @method validateProfileName
 * @param {string} trimmedName
 * @returns {void}
 */
export const validateProfileName = (trimmedName: string): void => {
    const validateError = validateFilenameChars(trimmedName)

    if (validateError) {
        throw new Error(localize(`error.wallet.${validateError}`))
    }

    if (getTrimmedLength(trimmedName) > MAX_PROFILE_NAME_LENGTH) {
        throw new Error(
            localize('error.profile.length', {
                values: {
                    length: MAX_PROFILE_NAME_LENGTH,
                },
            })
        )
    }

    if (get(profiles).some((p) => p.name === trimmedName)) {
        throw new Error(localize('error.profile.duplicate'))
    }
}
