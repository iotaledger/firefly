<script lang="ts">
    import { MimeType, ParentMimeType, getParentMimeType } from '@core/nfts'

    export let src: string
    export let expectedType: MimeType
    export let alt: string = ''
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let muted: boolean = false
    export let loop: boolean = false

    const htmlTag: ParentMimeType | undefined = getParentMimeType(expectedType)
    const videoElement: HTMLVideoElement | undefined = undefined
    let playPromise: Promise<void> | undefined

    function startPlaying() {
        if (!autoplay && videoElement) {
            playPromise = videoElement.play()
        }
    }

    function stopPlaying() {
        if (!autoplay && playPromise !== undefined && videoElement) {
            playPromise
                .then(() => {
                    videoElement.pause()
                })
                .catch(() => {})
        }
    }
</script>

<div class="h-full w-full object-cover">
    {#if htmlTag === ParentMimeType.Image || htmlTag === ParentMimeType.Text}
        <img {src} {alt} loading="lazy" class="w-full h-full object-cover" />
    {:else if htmlTag === ParentMimeType.Video}
        <video
            loop={loop ? true : undefined}
            muted={muted ? true : undefined}
            controls={controls ? true : undefined}
            autoplay={autoplay ? true : undefined}
            on:mouseenter={startPlaying}
            on:mouseleave={stopPlaying}
            preload="metadata"
            class="w-full h-full object-cover"
        >
            <source {src} type={expectedType} />
        </video>
    {/if}
</div>
