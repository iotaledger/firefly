import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { selectedAccountAssets } from '../stores'

export async function burnAsset(assetId: string): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        const balance = get(selectedAccountAssets).nativeTokens.find((_asset) => _asset.id === assetId)?.balance
            .available
        if (balance) {
            await account.burnNativeToken(assetId, '0x' + balance.toString(16))
        }
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        } else {
            handleError(err)
        }
    }
}
