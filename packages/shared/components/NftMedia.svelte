<script lang="ts">
    import { INft, NFT_MEDIA_FILE_NAME, nftDownloadQueue } from '@core/nfts'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import features from '@features/features'
    import { MediaDisplay, MediaPlaceholder } from '@ui'
    import { onMount } from 'svelte'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let useCaching: boolean = true

    let hasMounted: boolean = false
    let basePath: string

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nft.id)
    $: src =
        features?.collectibles?.useCaching?.enabled && useCaching
            ? `${basePath}/${nft.filePath}/${NFT_MEDIA_FILE_NAME}`
            : nft.downloadUrl

    onMount(async () => {
        if (process.env.NODE_ENV === 'development') {
            basePath = DEV_STORAGE_DIRECTORY
        } else {
            basePath = await getStorageDirectoryOfProfiles()
        }
        hasMounted = true
    })
</script>

{#if hasMounted && nft && nft.composedUrl && nft.parsedMetadata && (!useCaching || nft.downloadMetadata?.isLoaded)}
    <MediaDisplay
        {src}
        expectedType={nft.parsedMetadata.type}
        isLoaded={nft.downloadMetadata.isLoaded}
        {autoplay}
        {controls}
        {loop}
        {muted}
        {...$$restProps}
        alt={`Media display for ${nft.name}`}
    />
{:else}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} bgColor="bg-gray-200 dark:bg-gray-700" {isDownloading} />
    </slot>
{/if}
