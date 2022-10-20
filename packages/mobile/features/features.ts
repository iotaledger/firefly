import onboardingFeatures from './onboarding.features'

const features = {
    onboarding: onboardingFeatures,
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
        profileActions: {
            enabled: false,
        },
        accountSwitcher: {
            enabled: false,
        },
        accountActions: {
            enabled: false,
        },
        sendAndReceive: {
            enabled: false,
        },
        activity: {
            enabled: true,
            sync: {
                enabled: false,
            },
            search: {
                enabled: false,
            },
        },
        tokens: {
            enabled: true,
            search: {
                enabled: false,
            },
        },
        governance: {
            enabled: false,
        },
        collectibles: {
            enabled: false,
        },
    },
}

export default features
