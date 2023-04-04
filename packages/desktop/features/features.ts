const collectiblesFeatures = require('./collectibles.features.ts')
const developerToolsFeatures = require('./developer-tools.features.ts')
const electronFeatures = require('./electron.features.ts')
const governanceFeatures = require('./governance.features.ts')
const onboardingFeatures = require('./onboarding.features.ts')
const settingsFeatures = require('./settings.features.ts')
const walletFeatures = require('./wallet.features.ts')

module.exports = {
    collectibles: collectiblesFeatures,
    electron: electronFeatures,
    developerTools: developerToolsFeatures,
    governance: governanceFeatures,
    onboarding: onboardingFeatures,
    settings: settingsFeatures,
    wallet: walletFeatures,
}
