import { WalletTab } from '../enums'
import features from '../../../../features/features'

export const INITIAL_ACTIVE_TAB: WalletTab | null = getInitialActiveTab()

function getInitialActiveTab(): WalletTab | null {
    if (features?.tokens?.enabled) {
        return WalletTab.Tokens
    } else if (features?.activity?.enabled) {
        return WalletTab.Activity
    } else {
        return null
    }
}
