import collectiblesFeatures from './collectibles.features'
import developerToolsFeatures from './developer-tools.features'
import electronFeatures from './electron.features'
import governanceFeatures from './governance.features'
import { IDesktopFeatures } from './interfaces'
import onboardingFeatures from './onboarding.features'
import settingsFeatures from './settings.features'
import walletFeatures from './wallet.features'

const features: IDesktopFeatures = {
    onboarding: onboardingFeatures,
    settings: settingsFeatures,
    wallet: walletFeatures,
    collectibles: collectiblesFeatures,
    governance: governanceFeatures,
    developerTools: developerToolsFeatures,
    electron: electronFeatures,
}

export default features
