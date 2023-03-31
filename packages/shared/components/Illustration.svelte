<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'

    export let illustration = undefined
    export let width = undefined
    export let height = undefined
    // when set "background" to true, the illustration will be displayed as a background image of a div
    // and a numeric height must be defined
    export let background = false
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustrations[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    const illustrations = {
        // Misc
        'balance-desktop': {
            lightmode: 'balance-desktop.svg',
            darkmode: 'balance-desktop-darkmode.svg',
        },
        'send-mobile': {
            lightmode: 'send-mobile.svg',
            darkmode: 'send-mobile-darkmode.svg',
        },
        'single-account-guide-desktop': {
            lightmode: 'onboarding/single-account-guide-desktop.svg',
            darkmode: 'onboarding/single-account-guide-desktop.svg',
        },
        'white-arrow': {
            lightmode: 'onboarding/white-arrow.svg',
            darkmode: 'onboarding/white-arrow.svg',
        },

        // Ledger
        'ledger-install-new-app-desktop': {
            lightmode: 'onboarding/ledger-install-new-app-desktop.svg',
            darkmode: 'onboarding/ledger-install-new-app-desktop.svg',
        },
        'ledger-live-updated-desktop': {
            lightmode: 'onboarding/ledger-live-updated-desktop.svg',
            darkmode: 'onboarding/ledger-live-updated-desktop-darkmode.svg',
        },
        'ledger-connected-2-desktop': {
            lightmode: 'onboarding/ledger-connected-2-desktop.svg',
            darkmode: 'onboarding/ledger-connected-2-desktop.svg',
        },
        'ledger-search-apps-desktop': {
            lightmode: 'onboarding/ledger-search-apps-desktop.svg',
            darkmode: 'onboarding/ledger-search-apps-desktop.svg',
        },
        'ledger-install-apps-desktop': {
            lightmode: 'onboarding/ledger-install-apps-desktop.svg',
            darkmode: 'onboarding/ledger-install-apps-desktop.svg',
        },
        'ledger-close-live-desktop': {
            lightmode: 'onboarding/ledger-close-live-desktop.svg',
            darkmode: 'onboarding/ledger-close-live-desktop.svg',
        },
        'ledger-background-live-desktop': {
            lightmode: 'onboarding/ledger-background-live-desktop.svg',
            darkmode: 'onboarding/ledger-background-live-desktop.svg',
        },
        'ledger-pin-desktop': {
            lightmode: 'onboarding/ledger-pin-desktop.svg',
            darkmode: 'onboarding/ledger-pin-desktop.svg',
        },
        'ledger-open-app-desktop': {
            lightmode: 'onboarding/ledger-open-app-desktop.svg',
            darkmode: 'onboarding/ledger-open-app-desktop.svg',
        },
        'ledger-support': {
            lightmode: 'onboarding/ledger-support.svg',
            darkmode: 'onboarding/ledger-support.svg',
        },
        // Staking
        'shimmer-info-bg': {
            lightmode: 'staking/shimmer-info.png',
            darkmode: 'staking/shimmer-info.png',
        },
        'assembly-info-bg': {
            lightmode: 'staking/assembly-info.png',
            darkmode: 'staking/assembly-info.png',
        },
        'staking-notification': {
            lightmode: 'staking/staking-notification.svg',
            darkmode: 'staking/staking-notification.svg',
        },
        // Governance
        'governance-info': {
            lightmode: 'governance/governance-info.svg',
            darkmode: 'governance/governance-info.svg',
        },
        'treasury-bg': {
            lightmode: 'governance/treasury.png',
            darkmode: 'governance/treasury.png',
        },
        'governance-not-found': {
            lightmode: 'governance/governance-not-found.svg',
            darkmode: 'governance/governance-not-found.svg',
        },
        'iota-governance': {
            lightmode: 'governance/iota-governance.png',
            darkmode: 'governance/iota-governance.png',
        },
    }
</script>

{#if selected}
    {#if background}
        <div
            class={classes}
            style="--height: {height}px; background-image: url(assets/illustrations/{selected}); background-size: 100%; background-position: center; padding: 5ch;"
        />
    {:else}
        <img
            data-label="illustration"
            class={classes}
            width={width || '100%'}
            height={height || '100%'}
            src={`assets/illustrations/${selected}`}
            alt=""
        />
    {/if}
{:else}
    <div class={`${classes}`} width={width || '100%'} height={height || '100%'} />
{/if}

<style type="text/scss">
    div {
        height: var(--height);
    }
</style>
