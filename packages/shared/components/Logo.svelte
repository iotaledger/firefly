<script lang="ts">
    import { appSettings, appStage } from '@core/app'
    import { get } from 'svelte/store'
    import { Logo as LogoEnum, LogoOverrideStage } from './enums'

    export let logo: LogoEnum
    export let width: string = '100%'
    export let height: string = '100%'
    export let overrideStage: undefined | LogoOverrideStage = undefined

    const logos = {
        [LogoEnum.LogoFireflyFull]: {
            alpha: 'firefly_logo_full.svg',
            beta: 'firefly_logo_full.svg',
            prod: 'firefly_logo_full.svg',
        },
        [LogoEnum.LogoFirefly]: {
            alpha: 'alpha_firefly_logo.svg',
            beta: 'beta_firefly_logo.svg',
            prod: 'prod_firefly_logo.svg',
        },
        [LogoEnum.LogoStronghold]: {
            alpha: 'stronghold.svg',
            beta: 'stronghold.svg',
            prod: 'stronghold.svg',
        },
        [LogoEnum.LogoChrysalisGem]: {
            alpha: 'chrysalis_gem.svg',
            beta: 'chrysalis_gem.svg',
            prod: 'chrysalis_gem.svg',
        },
    }

    $: darkModeEnabled = $appSettings.darkMode
    $: selected = logos[logo]?.[overrideStage ?? get(appStage)]
    $: logoSrc = darkModeEnabled ? `assets/logos/darkmode/${selected}` : `assets/logos/lightmode/${selected}`
</script>

{#if selected}
    <img data-label="logo" {width} {height} src={logoSrc} alt={selected} />
{/if}
