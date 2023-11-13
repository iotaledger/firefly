<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { ILLUSTRATIONS, IllustrationEnum } from '@auxiliary/illustration'
    import { appSettings } from '@core/app'
    import Icon from './Icon.svelte'

    export let illustration: IllustrationEnum | undefined = undefined
    export let width: string | undefined = undefined
    export let height: string | undefined = undefined
    export let zIndex: number | string = 'auto'
    export let iconNetwork: IconEnum | undefined = undefined

    $: darkModeEnabled = $appSettings.darkMode

    $: selected = illustration ? ILLUSTRATIONS[illustration]?.[darkModeEnabled ? 'darkmode' : 'lightmode'] : null
</script>

{#if selected}
    <div class="flex flex-col items-center justify-center">
        <img
            data-label="illustration"
            width={width || '100%'}
            height={height || '100%'}
            style={`z-index: ${zIndex}`}
            src={`assets/illustrations/${selected}`}
            alt=""
        />
        {#if iconNetwork}
            <div class="bg-blue-400 rounded-2xl w-12 h-12 flex justify-center items-center">
                <Icon icon={iconNetwork} width="32" height="32" classes="text-white" />
            </div>
        {/if}
    </div>
{:else}
    <div
        style={`width: ${width ? width + 'px' : '100%'}; 
        height: ${height ? height + 'px' : '100%'};
        z-index: ${zIndex}
        `}
    />
{/if}
