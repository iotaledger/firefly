import onboardingFeatures from './onboarding.features'

const features = {
    onboarding: onboardingFeatures,
    dashboard: {
        enabled: false,
        profileActions: {
            enabled: false,
            settings: {
                enabled: false,
            },
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
