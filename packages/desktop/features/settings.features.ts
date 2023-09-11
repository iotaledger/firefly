import { ISettingsFeatures } from '@lib/features/interfaces'

const settingsFeatures: ISettingsFeatures = {
    enabled: true,
    general: {
        enabled: true,
        theme: {
            enabled: true,
        },
        language: {
            enabled: true,
        },
        notifications: {
            enabled: true,
        },
        crashReporting: {
            enabled: true,
        },
        deepLinks: {
            enabled: true,
        },
    },
    profile: {
        enabled: true,
        changeProfileName: {
            enabled: true,
        },
        currency: {
            enabled: true,
        },
        deleteProfile: {
            enabled: true,
        },
    },
    security: {
        enabled: true,
        appLock: {
            enabled: true,
        },
        strongholdPasswordTimeout: {
            enabled: true,
        },
        changePincode: {
            enabled: true,
        },
        changePassword: {
            enabled: true,
        },
        exportStronghold: {
            enabled: true,
        },
    },
    collectibles: {
        enabled: true,
        maxMediaSize: {
            enabled: true,
        },
        maxMediaDownloadTime: {
            enabled: true,
        },
        refreshNftMedia: {
            enabled: true,
        },
    },
    network: {
        enabled: true,
        networkInformation: {
            enabled: true,
        },
        configureNodeList: {
            enabled: true,
        },
        localProofOfWork: {
            enabled: true,
        },
    },
    advanced: {
        enabled: true,
        balanceFinder: {
            enabled: true,
        },
        hiddenAccounts: {
            enabled: true,
        },
        developerToggle: {
            enabled: true,
        },
    },
    helpAndInfo: {
        enabled: true,
        diagnostics: {
            enabled: true,
        },
        errorLog: {
            enabled: true,
        },
        documentation: {
            enabled: true,
        },
        faq: {
            enabled: true,
        },
        discord: {
            enabled: true,
        },
        reportAnIssue: {
            enabled: true,
        },
    },
}

export default settingsFeatures
