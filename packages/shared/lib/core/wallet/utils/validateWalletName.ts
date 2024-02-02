import { localize } from '@core/i18n'
import { activeWallets } from '@core/profile'
import { getTrimmedLength } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_WALLET_NAME_LENGTH } from '../constants'

export function validateWalletName(
    name: string,
    validateLength = true,
    validateDuplicate = true
): Promise<void | string> {
    if (validateLength && getTrimmedLength(name) > MAX_WALLET_NAME_LENGTH) {
        return Promise.reject(
            new Error(
                localize('error.wallet.length', {
                    values: {
                        length: MAX_WALLET_NAME_LENGTH,
                    },
                })
            )
        )
    }
    if (validateDuplicate && get(activeWallets)?.find((existingWallet) => existingWallet.name === name)) {
        return Promise.reject(new Error(localize('error.wallet.duplicate')))
    }
    return Promise.resolve()
}
