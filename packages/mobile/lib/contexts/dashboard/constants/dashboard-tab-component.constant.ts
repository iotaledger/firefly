import { ActivityTab, TokensTab } from '../../../../views/dashboard/tabs'
import { DashboardTab } from '../enums/dashboard-tab.enum'

export const DASHBOARD_TAB_COMPONENT = {
    [DashboardTab.Tokens]: TokensTab,
    [DashboardTab.Activity]: ActivityTab,
}
