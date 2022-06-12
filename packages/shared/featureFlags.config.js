const featureFlags = {
    onboarding: {
        enabled: true,
    },
    settings: {
        enabled: true,
    },
    wallet: {
        enabled: true,
        accountSummaryAndAssets: {
            enabled: true,
        },
        activityHistory: {
            enabled: true,
            sync: {
                enabled: false,
            },
            search: {
                enabled: true,
            },
        },
        portfolioChart: {
            enabled: false,
        },
        activityChart: {
            enabled: false,
        },
    },
    staking: {
        enabled: false,
    },
    governance: {
        enabled: false,
    },
    collectibles: {
        enabled: false,
    },
}

export default featureFlags
