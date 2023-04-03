<script lang="ts">
    import { onMount } from 'svelte'

    import { MimeType, NFT_MEDIA_FILE_NAME, ParentMimeType } from '@core/nfts'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile'
    import features from '../../../desktop/features/features'

    export let Media: HTMLImageElement | HTMLVideoElement = undefined
    export let filePath: string
    export let url: string
    export let isLoaded: boolean
    export let expectedType: MimeType
    export let classes: string = ''
    export let alt: string = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    const type: string = convertMimeTypeToHtmlTag(expectedType)

    let isMounted = false
    let basePath: string

    $: isLoaded && muteVideo()
    $: src = features?.collectibles?.useCaching?.enabled ? `${basePath}/${filePath}/${NFT_MEDIA_FILE_NAME}` : url

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
            basePath = DEV_STORAGE_DIRECTORY
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
            {src}
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
