<script lang="typescript">
    import { appSettings } from 'shared/lib/appSettings'

    export let logo = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    let darkModeEnabled = $appSettings.darkMode

    $: selected = logos[logo]?.[darkModeEnabled ? 'darkmode' : 'default']

    const logos = {
        'logo-firefly-full': {
            default: 'firefly_logo_full.svg',
            darkmode: 'firefly_logo_full_darkmode.svg',
        },
        'logo-firefly': {
            default: 'firefly_logo.svg',
            darkmode: 'firefly_logo.svg',
        },
        'logo-stronghold': {
            default: 'stronghold.svg',
            darkmode: 'stronghold_darkmode.svg',
        }
    }
</script>

{#if selected}
    <img
        data-label="logo"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/logos/${selected}`}
        alt="" />
{/if}
