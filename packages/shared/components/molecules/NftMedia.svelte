<script lang="ts">
    import { INft, nftDownloadQueue } from '@core/nfts'
    import { MediaDisplay } from '@ui'
    import MediaPlaceholder from './MediaPlaceholder.svelte'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''

    const bgColor = 'gray-200'
    const darkBgColor = 'gray-700'

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nft.id)
</script>

{#if !nft?.composedUrl || !nft.downloadMetadata?.isLoaded}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} {isDownloading} />
    </slot>
{:else}
    <MediaDisplay
        filePath={nft.filePath}
        url={nft.downloadUrl}
        isLoaded={nft.downloadMetadata.isLoaded}
        expectedType={nft.parsedMetadata.type}
        alt={`Media display for ${nft.name}`}
        {autoplay}
        {controls}
        {loop}
        {muted}
        {classes}
    />
{/if}
