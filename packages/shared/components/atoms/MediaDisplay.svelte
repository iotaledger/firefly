<script lang="typescript">
    import { MimeType, ParentMimeType } from '@core/nfts'

    export let Media: HTMLImageElement | HTMLVideoElement
    export let src: string
    export let expectedType: MimeType
    export let classes: string
    export let alt
    export let onError: () => unknown
    export let onLoad: () => unknown
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    let isLoaded = false
    let safeToLoad = false

    let type: string
    $: type = convertMimeTypeToHtmlTag(expectedType)

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
                onError()
                return undefined
        }
    }

    function handleLoadedMetadata() {
        isLoaded = true
        if (type === 'video') {
            onLoad && onLoad()
        }
    }

    function handleLoaded() {
        isLoaded = true
        onLoad && onLoad()
    }

    $: {
        if (src && typeof src === 'string') {
            fetch(src, { method: 'HEAD' })
                .then((response) => {
                    if (response.headers.get('Content-Type') === expectedType) {
                        safeToLoad = true
                    } else {
                        onError()
                    }
                })
                .catch(() => {
                    onError()
                })
        } else {
            onError()
        }
    }
</script>

{#if safeToLoad}
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
        on:load={handleLoaded}
        on:loadedmetadata={handleLoadedMetadata}
        on:error={onError}
        on:mouseenter={startPlaying}
        on:mouseleave={stopPlaying}
    />
{/if}
