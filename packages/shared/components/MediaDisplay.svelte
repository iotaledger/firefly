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
</script>

<div class="h-full w-full object-cover">
    {#if htmlTag === ParentMimeType.Image}
        <img {src} {alt} />
    {:else if htmlTag === ParentMimeType.Video}
        <video
            {...$$props}
            {controls}
            {loop}
            {muted}
            autoplay={autoplay ? true : undefined}
            on:mouseenter={startPlaying}
            on:mouseleave={stopPlaying}
            preload="metadata"
        >
            <source {src} type={expectedType} />
        </video>
    {/if}
</div>
