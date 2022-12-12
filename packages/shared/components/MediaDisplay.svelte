<script lang="typescript">
    import { MimeType, ParentMimeType } from '@core/nfts'

    export let Media: HTMLImageElement | HTMLVideoElement | HTMLAudioElement
    export let src: string | unknown
    export let expectedType: MimeType
    export let classes: string
    export let alt
    export let onError: () => unknown
    export let onLoad: () => unknown
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    let type
    $: type = convertMimeTypeToHtmlTag(expectedType)

    function startPlaying() {
        if (type === 'video' && !autoplay) {
            (Media as HTMLVideoElement).play()
        }
    }

    function stopPlaying() {
        if (type === 'video' && !autoplay) {
            (Media as HTMLVideoElement).pause()
        }
    }

    function convertMimeTypeToHtmlTag(mimeType: MimeType): string {
        const parentMimeType = mimeType?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return 'img'
            case ParentMimeType.Video:
                return 'video'
            case ParentMimeType.Audio:
                return 'audio'
            default:
                onError()
                return undefined
        }
    }

    $: if (type === 'video' && (Media as HTMLVideoElement)?.readyState === 4) {
        onLoad()
    }

    // TODO: find a way to check the type of the file without downloading it
    // or decide which is better the content security policy or this check
    /* $: {
        if (src && typeof src === 'string') {
            fetch(src)
            .then(response => response.blob())
            .then(blob => {
                if (blob.type === expectedType) {
                    type = convertMimeTypeToHtmlTag(blob.type);
                } else {
                    onError()
                }
            })
            .catch(() => {
                onError()
            });
        } else {
            onError()
        }
    } */
</script>

<svelte:element
    this={type}
    bind:this={Media}
    {src}
    {alt}
    autoplay={autoplay ? true : undefined}
    controls={controls ? true : undefined}
    loop={loop ? true : undefined}
    muted={muted ? true : undefined}
    class={classes}
    on:error={onError}
    on:load={onLoad}
    on:mouseenter={startPlaying}
    on:mouseleave={stopPlaying}
/>
