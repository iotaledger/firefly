<script lang="typescript">
    import { darkMode } from 'shared/lib/app'

    export let logo = undefined
    export let width = undefined
    export let height = undefined
    export let classes = ''

    $: selected = logos[logo]?.[$darkMode ? 'darkmode' : 'default']

    const logos = {
        'logo-firefly-full': {
            default: 'firefly_logo_full.svg',
            darkmode: 'firefly_logo_full_darkmode.svg',
        },
        'logo-firefly': {
            default: 'firefly_logo.svg',
            darkmode: 'firefly_logo.svg',
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
        alt="" />
{/if}
