import { DashboardTab } from '../enums'
import features from '../../../../features/features'

export const INITIAL_ACTIVE_DASHBOARD_TAB: DashboardTab | null = getInitialActiveTab()

function getInitialActiveTab(): DashboardTab | null {
    if (features?.dashboard?.tokens?.enabled) {
        return DashboardTab.Tokens
    } else if (features?.dashboard?.activity?.enabled) {
        return DashboardTab.Activity
    } else {
        return null
    }
}
