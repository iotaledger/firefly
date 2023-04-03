const collectiblesFeatures = require('./collectibles.features.js')
const developerToolsFeatures = require('./developer-tools.features.js')
const electronFeatures = require('./electron.features.js')
const governanceFeatures = require('./governance.features.js')
const onboardingFeatures = require('./onboarding.features.js')
const settingsFeatures = require('./settings.features.js')
const walletFeatures = require('./wallet.features.js')

const features = {
    collectibles: collectiblesFeatures,
    developerTools: developerToolsFeatures,
    electron: electronFeatures,
    governance: governanceFeatures,
    onboarding: onboardingFeatures,
    settings: settingsFeatures,
    wallet: walletFeatures,
}

module.exports = features
