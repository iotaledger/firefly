<script lang="ts">
    import { appSettings, appStage } from '@core/app'
    import { get } from 'svelte/store'

    export let logo = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''
    export let overrideStage: undefined | 'alpha' | 'beta' | 'prod' = undefined

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = logos[logo]?.[overrideStage ?? get(appStage)]

    const logos = {
        'logo-firefly-full': {
            alpha: 'firefly_logo_full.svg',
            beta: 'firefly_logo_full.svg',
            prod: 'firefly_logo_full.svg',
        },
        'logo-firefly': {
            alpha: 'alpha_firefly_logo.svg',
            beta: 'beta_firefly_logo.svg',
            prod: 'prod_firefly_logo.svg',
        },
        'logo-stronghold': {
            alpha: 'stronghold.svg',
            beta: 'stronghold.svg',
            prod: 'stronghold.svg',
        },
        'logo-chrysalis-gem': {
            alpha: 'chrysalis_gem.svg',
            beta: 'chrysalis_gem.svg',
            prod: 'chrysalis_gem.svg',
        },
    }
</script>

{#if selected}
    <img
        data-label="logo"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/logos/${darkModeEnabled ? 'darkmode' : 'lightmode'}/${selected}`}
        alt=""
    />
{/if}
