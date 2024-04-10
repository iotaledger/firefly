<script lang="ts">
    import { INft, NFT_MEDIA_FILE_NAME, nftDownloadQueue } from '@core/nfts'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import features from '@features/features'
    import { MediaDisplay, MediaPlaceholder } from '@ui'
    import { DirectoryManager } from 'shared/lib/core/profile'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let useCaching: boolean = true
    export { classes as class }

    let classes: string = ''
    const basePath = process.env.NODE_ENV === 'development' ? DEV_STORAGE_DIRECTORY : DirectoryManager.forProfiles()

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nft.id)
    $: src =
        features?.collectibles?.useCaching?.enabled && useCaching
            ? `${basePath}/${nft.filePath}/${NFT_MEDIA_FILE_NAME}`
            : nft.downloadUrl
</script>

{#if nft && nft.composedUrl && nft.parsedMetadata && (!useCaching || nft.downloadMetadata?.isLoaded)}
    <MediaDisplay
        {src}
        expectedType={nft.parsedMetadata.type}
        {autoplay}
        {controls}
        {loop}
        {muted}
        class={classes}
        alt={`Media display for ${nft.name}`}
    />
{:else}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} bgColor="bg-gray-200 dark:bg-gray-700" {isDownloading} />
    </slot>
{/if}
