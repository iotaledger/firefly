import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { api } from '@core/profile-manager'

import { MissingShimmerClaimingProfileManagerError } from '../errors'
import { prepareShimmerClaimingAccount } from '../helpers'
import { IShimmerClaimingAccount } from '../interfaces'
import { shimmerClaimingProfileManager } from '../stores'

export async function initialiseShimmerClaimingAccount(): Promise<IShimmerClaimingAccount> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    if (!_shimmerClaimingProfileManager) {
        throw new MissingShimmerClaimingProfileManagerError()
    }

    const unboundAccount = await _shimmerClaimingProfileManager?.createAccount({
        alias: `${localize('general.account')} 1`,
    })
    const boundAccount = await api.getAccount(_shimmerClaimingProfileManager?.id, unboundAccount?.meta?.index)
    const balance = await boundAccount?.sync()
    return prepareShimmerClaimingAccount(boundAccount, balance)
}
