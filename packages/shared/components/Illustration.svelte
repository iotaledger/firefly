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
            lightmode: 'import-from-ledger-desktop.svg',
            darkmode: 'import-from-ledger-desktop.svg',
        },
        'import-from-firefly-ledger-desktop': {
            lightmode: 'import-from-firefly-ledger-desktop.svg',
            darkmode: 'import-from-firefly-ledger-desktop.svg',
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
