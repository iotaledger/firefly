<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'

    export let illustration = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustrations[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    const illustrations = {
        'balance-desktop': {
            lightmode: 'balance-desktop.svg',
            darkmode: 'balance-desktop-darkmode.svg',
        },
        'ledger-connected-desktop': {
            lightmode: 'onboarding/ledger-connected-desktop.svg',
            darkmode: 'onboarding/ledger-connected-desktop-darkmode.svg',
        },
        'ledger-disconnected-desktop': {
            lightmode: 'onboarding/ledger-disconnected-desktop.svg',
            darkmode: 'onboarding/ledger-disconnected-desktop-darkmode.svg',
        },
        'ledger-install-new-app-desktop': {
            lightmode: 'onboarding/ledger-install-new-app-desktop.svg',
            darkmode: 'onboarding/ledger-install-new-app-desktop-darkmode.svg',
        },
        'ledger-generate-address-desktop': {
            lightmode: 'onboarding/ledger-generate-address-desktop.svg',
            darkmode: 'onboarding/ledger-generate-address-desktop-darkmode.svg',
        },
        'ledger-confirm-address-desktop': {
            lightmode: 'onboarding/ledger-confirm-address-desktop.svg',
            darkmode: 'onboarding/ledger-confirm-address-desktop-darkmode.svg',
        },
        'ledger-address-confirmed-desktop': {
            lightmode: 'onboarding/ledger-address-confirmed-desktop.svg',
            darkmode: 'onboarding/ledger-address-confirmed-desktop-darkmode.svg',
        },
        'ledger-switch-app-desktop': {
            lightmode: 'onboarding/ledger-switch-app-desktop.svg',
            darkmode: 'onboarding/ledger-switch-app-desktop-darkmode.svg',
        },
        'ledger-choose-index-desktop': {
            lightmode: 'onboarding/ledger-choose-index-desktop.svg',
            darkmode: 'onboarding/ledger-choose-index-desktop-darkmode.svg',
        },
        'ledger-migrate-desktop': {
            lightmode: 'onboarding/ledger-migrate-desktop.svg',
            darkmode: 'onboarding/ledger-migrate-desktop-darkmode.svg',
        },
        'ledger-live-updated-desktop': {
            lightmode: 'onboarding/ledger-live-updated-desktop.svg',
            darkmode: 'onboarding/ledger-live-updated-desktop-darkmode.svg',
        },
        'ledger-connected-2-desktop': {
            lightmode: 'onboarding/ledger-connected-2-desktop.svg',
            darkmode: 'onboarding/ledger-connected-2-desktop-darkmode.svg',
        },
        'ledger-search-apps-desktop': {
            lightmode: 'onboarding/ledger-search-apps-desktop.svg',
            darkmode: 'onboarding/ledger-search-apps-desktop-darkmode.svg',
        },
        'ledger-install-apps-desktop': {
            lightmode: 'onboarding/ledger-install-apps-desktop.svg',
            darkmode: 'onboarding/ledger-install-apps-desktop-darkmode.svg',
        },
        'ledger-close-live-desktop': {
            lightmode: 'onboarding/ledger-close-live-desktop.svg',
            darkmode: 'onboarding/ledger-close-live-desktop-darkmode.svg',
        },
        'ledger-background-live-desktop': {
            lightmode: 'onboarding/ledger-background-live-desktop.svg',
            darkmode: 'onboarding/ledger-background-live-desktop-darkmode.svg',
        },
        'ledger-pin-desktop': {
            lightmode: 'onboarding/ledger-pin-desktop.svg',
            darkmode: 'onboarding/ledger-pin-desktop-darkmode.svg',
        },
        'ledger-open-app-desktop': {
            lightmode: 'onboarding/ledger-open-app-desktop.svg',
            darkmode: 'onboarding/ledger-open-app-desktop-darkmode.svg',
        },
    }
</script>

{#if selected}
    <img
        data-label="illustration"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/illustrations/${selected}`}
        alt="" />
{:else}
    <div class={`${classes}`} width={width || '100%'} height={height || '100%'} />
{/if}
