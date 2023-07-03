<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { onMount } from 'svelte'

    export let Media: HTMLImageElement | HTMLVideoElement | undefined = undefined
    export let src: string
    export let expectedType: MimeType
    export let alt: string = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false
    export let isLoaded: boolean

    const htmlTag: string | undefined = convertMimeTypeToHtmlTag(expectedType)

    let isMounted = false

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

    function convertMimeTypeToHtmlTag(mimeType: MimeType): string | undefined {
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

    onMount(() => {
        isMounted = true
    })
</script>

{#if isMounted}
    {#key isLoaded && src}
        <svelte:element
            this={htmlTag}
            bind:this={Media}
            {...$$props}
            class="h-full w-full"
            on:mouseenter={startPlaying}
            on:mouseleave={stopPlaying}
        >
            {#if htmlTag === ParentMimeType.Image}
                <img {src} {alt} />
            {:else if htmlTag === ParentMimeType.Video}
                <video
                    {src}
                    autoplay={autoplay ? true : undefined}
                    controls={controls ? true : undefined}
                    loop={loop ? true : undefined}
                    muted
                    preload="metadata"
                />
            {/if}
        </svelte:element>
    {/key}
{/if}
