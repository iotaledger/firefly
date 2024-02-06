import { IDeveloperFeatures } from '@lib/features/interfaces'

const developerToolsFeatures: IDeveloperFeatures = {
    enabled: true,
    faucet: {
        enabled: true,
    },
    mintNft: {
        enabled: false,
    },
    mintNativeTokens: {
        enabled: false,
    },
    alias: {
        enabled: false,
    },
    refreshTokens: {
        enabled: true,
    },
    deeplink: {
        enabled: true,
    },
}

export default developerToolsFeatures
