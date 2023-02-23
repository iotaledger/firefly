<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { activeProfile } from '@core/profile'

    export let Media: HTMLImageElement | HTMLVideoElement = undefined
    export let url: string
    export let backupUrl: string
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

    let src: string

    const type: string = convertMimeTypeToHtmlTag(expectedType)
    let safeToLoad = false
    let isLoaded = false
    const MAX_FILE_SIZE_IN_BYTES = ($activeProfile?.settings?.maxMediaSizeInMegaBytes ?? 0) * 1000000

    $: url && void checkContentIsSafeToLoad()
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
                onWarning('error.nft.unsupportedFileType.')
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
            if (type && url && typeof url === 'string') {
                const response = await fetch(url, { method: 'HEAD', cache: 'force-cache' })
                if (response.headers.get('Content-Type') !== expectedType) {
                    if (backupUrl) {
                        const response = await fetch(backupUrl, { method: 'HEAD', cache: 'force-cache' })
                        if (response.headers.get('Content-Type') !== expectedType) {
                            safeToLoad = false
                            onError('error.nft.notMatchingFileTypes.')
                        } else {
                            src = backupUrl
                            safeToLoad = true
                        }
                    } else {
                        safeToLoad = false
                        onError('error.nft.notMatchingFileTypes.')
                    }
                } else if (
                    MAX_FILE_SIZE_IN_BYTES > 0 &&
                    Number(response.headers.get('Content-Length')) > MAX_FILE_SIZE_IN_BYTES
                ) {
                    safeToLoad = false
                    onWarning('error.nft.tooLargeFile.')
                } else {
                    src = url
                    safeToLoad = true
                }
            }
        } catch (error) {
            safeToLoad = false
            onError('error.nft.unsafeToLoad.')
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
