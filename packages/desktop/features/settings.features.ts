const settingsFeatures = {
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
            enabled: false,
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
    },
    network: {
        enabled: true,
        networkConfiguration: {
            enabled: true,
        },
    },
    advanced: {
        enabled: true,
        walletFinder: {
            enabled: true,
        },
        hiddenAccounts: {
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
