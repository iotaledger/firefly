import { ActivityTab, TokensTab } from '../../../../views/dashboard/tabs'
import { DashboardTab } from '../enums'

export const DASHBOARD_TAB_COMPONENT = {
    [DashboardTab.Tokens]: TokensTab,
    [DashboardTab.Activity]: ActivityTab,
}
