<script lang="ts">
    import { INft, NFT_MEDIA_FILE_NAME, nftDownloadQueue } from '@core/nfts'
    import { DEV_STORAGE_DIRECTORY } from '@core/profile/constants'
    import { getStorageDirectoryOfProfiles } from '@core/profile/utils'
    import features from '@features/features'
    import { MediaDisplay } from '@ui'
    import { onMount } from 'svelte'
    import MediaPlaceholder from './MediaPlaceholder.svelte'

    export let nft: INft
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''

    const bgColor = 'gray-200'
    const darkBgColor = 'gray-700'

    let basePath: string

    $: isDownloading = $nftDownloadQueue.some((queueItem) => queueItem.nft.id === nft.id)
    $: src = features?.collectibles?.useCaching?.enabled
        ? `${basePath}/${nft.filePath}/${NFT_MEDIA_FILE_NAME}`
        : nft.downloadUrl

    onMount(async () => {
        if (process.env.NODE_ENV === 'development') {
            basePath = DEV_STORAGE_DIRECTORY
        } else {
            basePath = await getStorageDirectoryOfProfiles()
        }
    })
</script>

{#if !nft?.composedUrl || !nft.downloadMetadata?.isLoaded}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} {isDownloading} />
    </slot>
{:else}
    <MediaDisplay
        {src}
        expectedType={nft.parsedMetadata.type}
        isLoaded={nft.downloadMetadata.isLoaded}
        {autoplay}
        {controls}
        {loop}
        {muted}
        {classes}
        alt={`Media display for ${nft.name}`}
    />
{/if}
