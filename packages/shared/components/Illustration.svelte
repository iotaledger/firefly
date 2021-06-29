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
        // TODO: ledger replace with animations
        'import-from-ledger-desktop': {
            lightmode: 'onboarding/import-from-ledger-desktop.svg',
            darkmode: 'onboarding/import-from-ledger-desktop.svg',
        },
        'ledger-connect-connected-desktop': {
            lightmode: 'onboarding/ledger-connect-connected-desktop.svg',
            darkmode: 'onboarding/ledger-connect-connected-desktop.svg',
        },
        'ledger-connect-disconnected-desktop': {
            lightmode: 'onboarding/ledger-connect-disconnected-desktop.svg',
            darkmode: 'onboarding/ledger-connect-disconnected-desktop.svg',
        },
        'ledger-generate-address-desktop': {
            lightmode: 'onboarding/ledger-generate-address-desktop.svg',
            darkmode: 'onboarding/ledger-generate-address-desktop.svg',
        },
        'ledger-generate-address-success-desktop': {
            lightmode: 'onboarding/ledger-generate-address-success-desktop.svg',
            darkmode: 'onboarding/ledger-generate-address-success-desktop.svg',
        },
        'ledger-switch-app-desktop': {
            lightmode: 'onboarding/ledger-switch-app-desktop.svg',
            darkmode: 'onboarding/ledger-switch-app-desktop.svg',
        },
        'ledger-choose-index-desktop': {
            lightmode: 'onboarding/ledger-choose-index-desktop.svg',
            darkmode: 'onboarding/ledger-choose-index-desktop.svg',
        },
        'ledger-migrate-desktop': {
            lightmode: 'onboarding/ledger-migrate-desktop.svg',
            darkmode: 'onboarding/ledger-migrate-desktop.svg',
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
