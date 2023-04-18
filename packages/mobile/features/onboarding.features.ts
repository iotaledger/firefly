import { IOnboardingFeaturesForNetwork } from '@lib/features/interfaces'
import { OnboardingFeatures } from '@lib/features/types'

const onboardingFeaturesForIota: IOnboardingFeaturesForNetwork = {
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
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: false,
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

const onboardingFeaturesForTestnet: IOnboardingFeaturesForNetwork = {
    enabled: true,
    newProfile: {
        enabled: true,
        softwareProfile: {
            enabled: true,
        },
        ledgerProfile: {
            enabled: false,
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
    enabled: false,
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

const onboardingFeatures: OnboardingFeatures = {
    enabled: true,
    iota: onboardingFeaturesForIota,
    shimmer: onboardingFeaturesForShimmer,
    testnet: onboardingFeaturesForTestnet,
    custom: onboardingFeaturesForCustom,
    strongholdVersionCheck: {
        enabled: false,
    },
}

export default onboardingFeatures
