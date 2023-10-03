<script lang="ts">
    import { ILLUSTRATIONS, IllustrationEnum } from '@auxiliary/illustration'
    import { appSettings } from '@core/app'

    export let illustration: IllustrationEnum | undefined = undefined
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined
    export let zIndex: number | string = 'auto'

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustration ? ILLUSTRATIONS[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null
</script>

{#if selected}
    <img
        data-label="illustration"
        width={width || '100%'}
        height={height || '100%'}
        style={`z-index: ${zIndex}`}
        src={`illustrations/${selected}`}
        alt=""
    />
{:else}
    <div
        style={`width: ${width ? width + 'px' : '100%'}; 
        height: ${height ? height + 'px' : '100%'};
        z-index: ${zIndex}
        `}
    />
{/if}
