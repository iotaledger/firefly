import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { Converter } from '@core/utils'
import { get } from 'svelte/store'
import { selectedAccountAssets } from '../stores'

export async function burnAsset(assetId: string): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    const nativeTokens = get(selectedAccountAssets).nativeTokens
    try {
        const balance = nativeTokens.find((_asset) => _asset.id === assetId)?.balance.available
        if (balance) {
            await account.burnNativeToken(assetId, Converter.decimalToHex(balance, true))
        }
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
    }
}
