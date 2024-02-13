import collectiblesFeatures from './collectibles.features'
import developerToolsFeatures from './developer-tools.features'
import electronFeatures from './electron.features'
import governanceFeatures from './governance.features'
import networkFeatures from './network.features'
import onboardingFeatures from './onboarding.features'
import settingsFeatures from './settings.features'
import walletFeatures from './wallet.features'
import analyticsFeatures from './analytics.features'
import vestingFeatures from './vesting.features'
import accountManagementFeatures from './account-management.features'
import delegationFeatures from './delegation.features'
import { IDesktopFeatures } from './interfaces'

const features: IDesktopFeatures = {
    collectibles: collectiblesFeatures,
    developerTools: developerToolsFeatures,
    electron: electronFeatures,
    governance: governanceFeatures,
    network: networkFeatures,
    onboarding: onboardingFeatures,
    settings: settingsFeatures,
    wallet: walletFeatures,
    analytics: analyticsFeatures,
    vesting: vestingFeatures,
    accountManagement: accountManagementFeatures,
    delegation: delegationFeatures,
}

export default features
