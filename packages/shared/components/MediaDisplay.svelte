<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'

    export let src: string
    export let expectedType: MimeType
    export const alt: string = ''
    export const autoplay: boolean = false
    export const controls: boolean = false
    export const muted: boolean = false
    export const loop: boolean = false
    export let isLoaded: boolean

    const htmlTag: string | undefined = convertMimeTypeToHtmlTag(expectedType)
    const videoElement: HTMLVideoElement | undefined = undefined

    $: isLoaded && muteVideo()

    // Why is this needed? We are already passing the muted attribute to the element below
    function muteVideo() {
        if (muted && videoElement) {
            videoElement.muted = true
        }
    }

    function startPlaying() {
        if (!autoplay && videoElement) {
            videoElement.play()
        }
    }

    function stopPlaying() {
        if (!autoplay && videoElement) {
            videoElement.pause()
        }
    }

    // TODO: Make this agnostic
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
</script>

{#key isLoaded && src}
    <div class="h-full w-full object-cover">
        {#if htmlTag === ParentMimeType.Image}
            <img {src} {alt} />
        {:else if htmlTag === ParentMimeType.Video}
            <video
                {...$$props}
                autoplay={autoplay ? true : undefined}
                on:mouseenter={startPlaying}
                on:mouseleave={stopPlaying}
                preload="metadata"
            >
                <source {src} type={expectedType} />
            </video>
        {/if}
    </div>
{/key}
