import type { IOnboardingFeaturesForNetwork } from '@lib/features/interfaces'
import type { OnboardingFeatures } from '@lib/features/types'

const onboardingFeaturesForIota: IOnboardingFeaturesForNetwork = {
    enabled: true,
    hidden: false,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: false,
        hidden: true,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
    migrateFromLegacy: {
        enabled: true,
    },
}

const onboardingFeaturesForIotaTestnet: IOnboardingFeaturesForNetwork = {
    enabled: false,
    hidden: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: false,
        hidden: true,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
}

const IS_ALPHANET_ENABLED = process.env.STAGE !== 'prod'
const onboardingFeaturesForIotaAlphanet: IOnboardingFeaturesForNetwork = {
    enabled: IS_ALPHANET_ENABLED,
    hidden: !IS_ALPHANET_ENABLED,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: false,
        hidden: true,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
}

const onboardingFeaturesForShimmer: IOnboardingFeaturesForNetwork = {
    enabled: false,
    hidden: true,
    newProfile: {
        enabled: false,
        softwareProfile: {
            enabled: false,
        },
        ledgerProfile: {
            enabled: false,
        },
    },
    restoreProfile: {
        enabled: false,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
    claimRewards: {
        enabled: false,
        hidden: false,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
}

const onboardingFeaturesForShimmerTestnet: IOnboardingFeaturesForNetwork = {
    enabled: false,
    hidden: true,
    newProfile: {
        enabled: false,
        softwareProfile: {
            enabled: false,
        },
        ledgerProfile: {
            enabled: false,
        },
    },
    restoreProfile: {
        enabled: false,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
    claimRewards: {
        enabled: false,
        hidden: false,
        recoveryPhrase: {
            enabled: false,
        },
        strongholdBackup: {
            enabled: false,
        },
        ledgerBackup: {
            enabled: false,
        },
    },
}

const onboardingFeaturesForCustom: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: true,
        },
    },
    restoreProfile: {
        enabled: true,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
    claimRewards: {
        enabled: true,
        hidden: false,
        recoveryPhrase: {
            enabled: true,
        },
        strongholdBackup: {
            enabled: true,
        },
        ledgerBackup: {
            enabled: true,
        },
    },
}

const onboardingFeatures: OnboardingFeatures = {
    enabled: true,
    strongholdVersionCheck: {
        enabled: true,
    },
    iota: onboardingFeaturesForIota,
    iotaTestnet: onboardingFeaturesForIotaTestnet,
    iotaAlphanet: onboardingFeaturesForIotaAlphanet,
    shimmer: onboardingFeaturesForShimmer,
    shimmerTestnet: onboardingFeaturesForShimmerTestnet,
    custom: onboardingFeaturesForCustom,
}

export default onboardingFeatures
