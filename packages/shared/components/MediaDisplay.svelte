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
    export { classes as class }

    enum MediaTag {
        Image = 'img',
        Video = 'video',
    }

    let classes: string = ''
    let isMounted = false
    let playPromise: Promise<void> | undefined
    let htmlTag: MediaTag | undefined

    $: htmlTag = convertMimeTypeToHtmlTag(expectedType)
    $: isLoaded && muteVideo()

    function muteVideo(): void {
        if (muted && Media instanceof HTMLVideoElement) {
            Media.muted = true
        }
    }

    function startPlaying(): void {
        if (!autoplay && Media instanceof HTMLVideoElement) {
            playPromise = Media.play()
        }
    }

    function stopPlaying(): void {
        if (!autoplay && playPromise !== undefined) {
            playPromise
                .then(() => {
                    if (Media instanceof HTMLVideoElement) {
                        Media.pause()
                    }
                })
                .catch(() => {})
        }
    }

    function convertMimeTypeToHtmlTag(mimeType: MimeType): MediaTag | undefined {
        const parentMimeType = mimeType?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return MediaTag.Image
            case ParentMimeType.Video:
                return MediaTag.Video
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
        {#if htmlTag === MediaTag.Image}
            <img bind:this={Media} {src} {alt} class={classes} />
        {:else if htmlTag === MediaTag.Video}
            <video
                {src}
                bind:this={Media}
                autoplay={autoplay || null}
                controls={controls || null}
                loop={loop || null}
                muted={muted || null}
                on:mouseenter={startPlaying}
                on:mouseleave={stopPlaying}
                class={classes || null}
            />
        {/if}
    {/key}
{/if}
