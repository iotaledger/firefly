import { localize } from '@core/i18n'
import { activeProfile } from '@core/profile'
import { getTrimmedLength } from '@lib/helpers'
import { get } from 'svelte/store'
import { MAX_ACCOUNT_NAME_LENGTH } from '../constants'

export function validateAccountName(
    name: string,
    validateLength = true,
    validateDuplicate = true
): Promise<void | string> {
    const { accounts } = get(activeProfile)
    if (validateLength && getTrimmedLength(name) > MAX_ACCOUNT_NAME_LENGTH) {
        return Promise.reject(
            new Error(
                localize('error.account.length', {
                    values: {
                        length: MAX_ACCOUNT_NAME_LENGTH,
                    },
                })
            )
        )
    }
    if (validateDuplicate && get(accounts)?.find((existingAccount) => existingAccount.name === name)) {
        return Promise.reject(new Error(localize('error.account.duplicate')))
    }
    return Promise.resolve()
}
