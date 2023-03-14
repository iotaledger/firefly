<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import { onMount } from 'svelte'

    export let Media: HTMLImageElement | HTMLVideoElement = undefined
    export let filePath: string
    export let isLoaded: boolean
    export let expectedType: MimeType
    export let classes: string = ''
    export let alt = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    const type: string = convertMimeTypeToHtmlTag(expectedType)
    let isMounted = false

    let basePath: string
    $: isLoaded && muteVideo()

    function muteVideo() {
        if (muted && Media instanceof HTMLVideoElement) {
            Media.muted = true
        }
    }

    function startPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.play()
        }
    }

    function stopPlaying() {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            Media.pause()
        }
    }

    function convertMimeTypeToHtmlTag(mimeType: MimeType): string {
        const parentMimeType = mimeType?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return 'img'
            case ParentMimeType.Video:
                return 'video'
            default:
                return undefined
        }
    }

    onMount(async () => {
        if (process.env.NODE_ENV === 'development') {
            basePath = 'build/__storage__'
        } else {
            basePath = await getStorageDirectoryOfProfiles()
        }
        isMounted = true
    })
</script>

{#if isMounted}
    {#key isLoaded && basePath}
        <svelte:element
            this={type}
            bind:this={Media}
            src="{basePath}/{filePath}/original"
            {alt}
            autoplay={autoplay ? true : undefined}
            controls={controls ? true : undefined}
            loop={loop ? true : undefined}
            muted
            class={classes}
            preload="metadata"
            on:mouseenter={startPlaying}
            on:mouseleave={stopPlaying}
        />
    {/key}
{/if}
