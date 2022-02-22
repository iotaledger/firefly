<script lang="typescript">
    import { beta } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'

    export let logo = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = logos[beta ? 'beta' : 'prod']?.[logo]?.[darkModeEnabled ? 'darkmode' : 'lightmode']

    const logos = {
        prod: {
            'logo-firefly-full': {
                lightmode: 'firefly_logo_full.svg',
                darkmode: 'firefly_logo_full_darkmode.svg',
            },
            'logo-firefly': {
                lightmode: 'firefly_logo.svg',
                darkmode: 'firefly_logo.svg',
            },
            'logo-stronghold': {
                lightmode: 'stronghold.svg',
                darkmode: 'stronghold_darkmode.svg',
            },
            'logo-chrysalis-gem': {
                lightmode: 'chrysalis_gem.svg',
                darkmode: 'chrysalis_gem.svg',
            },
        },
        beta: {
            'logo-firefly-full': {
                lightmode: 'firefly_logo_full_beta.svg',
                darkmode: 'firefly_logo_full_darkmode_beta.svg',
            },
            'logo-firefly': {
                lightmode: 'firefly_logo_beta.svg',
                darkmode: 'firefly_logo_beta.svg',
            },
            'logo-stronghold': {
                lightmode: 'stronghold.svg',
                darkmode: 'stronghold_darkmode.svg',
            },
            'logo-chrysalis-gem': {
                lightmode: 'chrysalis_gem.svg',
                darkmode: 'chrysalis_gem.svg',
            },
        },
    }
</script>

{#if selected}
    <img
        data-label="logo"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/logos/${selected}`}
        alt=""
    />
{/if}
