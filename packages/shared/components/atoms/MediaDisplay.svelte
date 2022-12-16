<script lang="typescript">
    import { localize } from '@core/i18n'
    import { MimeType, ParentMimeType } from '@core/nfts'

    export let Media: HTMLImageElement | HTMLVideoElement
    export let src: string
    export let expectedType: MimeType
    export let classes: string = ''
    export let alt = ''
    export let onError: (a?: string) => unknown
    export let onWarning: (a?: string) => unknown
    export let onLoad: () => unknown
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    let type: string
    let safeToLoad = false
    let isLoaded = false
    const MAX_FILE_SIZE_IN_MB = 30000000

    $: type = convertMimeTypeToHtmlTag(expectedType)
    $: src && void checkContentIsSafeToLoad()
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

    async function checkContentIsSafeToLoad() {
        try {
            if (src && typeof src === 'string') {
                const response = await fetch(src, { method: 'HEAD', cache: 'force-cache' })
                if (response.headers.get('Content-Type') !== expectedType) {
                    safeToLoad = false
                    onError(localize('error.nft.notMatchingFileTypes'))
                } else if (Number(response.headers.get('Content-Length')) > MAX_FILE_SIZE_IN_MB) {
                    safeToLoad = false
                    onWarning(localize('error.nft.tooLargeFile'))
                } else {
                    safeToLoad = true
                }
            }
        } catch (error) {
            safeToLoad = false
            onError(localize('error.nft.generic'))
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
