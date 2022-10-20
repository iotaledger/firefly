import { ActivityTab, TokensTab } from '../../../../routes/dashboard/wallet/tabs'
import { WalletTab } from '../enums/wallet-tab.enum'

export const WALLET_TAB_COMPONENT = {
    [WalletTab.Tokens]: TokensTab,
    [WalletTab.Activity]: ActivityTab,
}
