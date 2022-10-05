import onboardingFeatures from './onboarding.features'
import developerToolsFeatures from './developer-tools.features'

const features = {
    onboarding: onboardingFeatures,
    developerTools: developerToolsFeatures,
    settings: {
        enabled: false,
        general: {
            enabled: false,
            theme: {
                enabled: false,
            },
            language: {
                enabled: false,
            },
            currency: {
                enabled: false,
            },
            notifications: {
                enabled: false,
            },
            networkStatus: {
                enabled: false,
            },
            changeProfileName: {
                enabled: false,
            },
        },
        security: {
            enabled: false,
            exportStronghold: {
                enabled: false,
            },
            appLock: {
                enabled: false,
            },
            changePassword: {
                enabled: false,
            },
            changePincode: {
                enabled: false,
            },
            deleteProfile: {
                enabled: false,
            },
        },
        advanced: {
            enabled: false,
            networkConfiguration: {
                enabled: false,
            },
            deepLinks: {
                enabled: false,
            },
            walletFinder: {
                enabled: false,
            },
            hiddenAccounts: {
                enabled: false,
            },
            errorLog: {
                enabled: false,
            },
            crashReporting: {
                enabled: false,
            },
            diagnostics: {
                enabled: false,
            },
            migrateLedgerIndex: {
                enabled: false,
            },
        },
        helpAndInfo: {
            enabled: false,
            documentation: {
                enabled: false,
            },
            faq: {
                enabled: false,
            },
            discord: {
                enabled: false,
            },
            reportAnIssue: {
                enabled: false,
            },
        },
    },
    wallet: {
        enabled: false,
        accountSummary: {
            enabled: false,
        },
        sendAndReceive: {
            enabled: false,
        },
        assets: {
            enabled: false,
        },
        activityHistory: {
            enabled: false,
            sync: {
                enabled: false,
            },
            search: {
                enabled: false,
            },
        },
    },
    governance: {
        enabled: false,
    },
    collectibles: {
        enabled: false,
    },
}

export default features
