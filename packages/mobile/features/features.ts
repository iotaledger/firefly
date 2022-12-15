import onboardingFeatures from './onboarding.features'

const features = {
    onboarding: onboardingFeatures,
    dashboard: {
        enabled: false,
        profileActions: {
            enabled: true,
        },
        accountSwitcher: {
            enabled: true,
        },
        accountActions: {
            enabled: false,
        },
        createAccount: {
            enabled: true,
        },
        send: {
            enabled: true,
        },
        receive: {
            enabled: true,
        },
        activity: {
            enabled: true,
            sync: {
                enabled: false,
            },
            search: {
                enabled: false,
            },
            details: {
                enabled: true,
            },
            actions: {
                enabled: true,
            },
        },
        tokens: {
            enabled: true,
            search: {
                enabled: false,
            },
            details: {
                enabled: true,
            },
            actions: {
                enabled: true,
            },
        },
        governance: {
            enabled: false,
        },
        collectibles: {
            enabled: false,
        },
    },
    settings: {
        enabled: true,
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
}

export default features
