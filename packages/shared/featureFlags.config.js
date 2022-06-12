const featureFlags = {
    onboarding: {
        enabled: true,
        iota: {
            enabled: false,
            mainnet: {
                enabled: false,
            },
            devnet: {
                enabled: false,
            },
            'private-net': {
                enabled: false,
            },
        },
        shimmer: {
            enabled: true,
            mainnet: {
                enabled: false,
            },
            devnet: {
                enabled: true,
            },
            'private-net': {
                enabled: false,
            },
        },
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
