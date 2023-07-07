<script lang="ts">
    import { ILLUSTRATIONS, IllustrationEnum } from '@auxiliary/illustration'
    import { appSettings } from '@core/app'

    export let illustration: IllustrationEnum | undefined = undefined
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined
    export let classes: string = ''

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustration ? ILLUSTRATIONS[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null
</script>

{#if selected}
    <img
        data-label="illustration"
        class={classes}
        width={width || '100%'}
        height={height || '100%'}
        src={`assets/illustrations/${selected}`}
        alt=""
    />
{:else}
    <div
        class={`${classes}`}
        style={`width: ${width ? width + 'px' : '100%'}; height: ${height ? height + 'px' : '100%'};`}
    />
{/if}
