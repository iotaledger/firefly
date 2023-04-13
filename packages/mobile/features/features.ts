import capacitorFeatures from './capacitor.features'
import onboardingFeatures from './onboarding.features'

const features = {
    capacitor: capacitorFeatures,
    onboarding: onboardingFeatures,
    dashboard: {
        enabled: false,
        profileActions: {
            enabled: true,
            backupProfile: {
                enabled: true,
            },
            networkStatus: {
                enabled: true,
            },
            profileLock: {
                enabled: true,
            },
        },
        accountSwitcher: {
            enabled: true,
        },
        accountActions: {
            enabled: true,
            customize: {
                enabled: true,
            },
            toggleVisibility: {
                enabled: true,
            },
            delete: {
                enabled: true,
            },
            balanceBreakdown: {
                enabled: true,
            },
            exportTransactions: {
                enabled: false,
            },
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
            burnAsset: {
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
    settings: {
        enabled: true,
        general: {
            enabled: true,
            theme: {
                enabled: true,
            },
            language: {
                enabled: true,
            },
            currency: {
                enabled: true,
            },
            notifications: {
                enabled: false,
            },
            networkStatus: {
                enabled: false,
            },
            changeProfileName: {
                enabled: true,
            },
        },
        security: {
            enabled: true,
            exportStronghold: {
                enabled: true,
            },
            appLock: {
                enabled: true,
            },
            changePassword: {
                enabled: true,
            },
            changePincode: {
                enabled: false,
            },
            deleteProfile: {
                enabled: false,
            },
        },
        advanced: {
            enabled: true,
            networkInformation: {
                enabled: true,
            },
            deepLinks: {
                enabled: false,
            },
            walletFinder: {
                enabled: true,
            },
            hiddenAccounts: {
                enabled: true,
            },
            errorLog: {
                enabled: true,
            },
            crashReporting: {
                enabled: false,
            },
            diagnostics: {
                enabled: true,
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
