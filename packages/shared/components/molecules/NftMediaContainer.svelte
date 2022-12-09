<script lang="typescript">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts, rewriteIpfsUri } from '@core/nfts'
    import { NftMediaSize, NftPlaceholderIcon } from 'shared/components'

    export let size: NftMediaSize = NftMediaSize.Medium
    export let nftId: string
    export let shape: 'square' | 'circle' | 'squircle' = 'squircle'
    export let classes: string = ''

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)

    let width
    let height
    let radius
    let padding
    let bgColor
    let darkBgColor
    $: size, setShapeAndSize()
    function setShapeAndSize(): void {
        switch (size) {
            case NftMediaSize.ExtraSmall:
                width = 'w-6'
                height = 'w-6'
                // squircle or circle
                radius = shape === 'squircle' ? 'md' : 'full'
                padding = 1
                bgColor = 'gray-500'
                darkBgColor = 'gray-500'
                break
            case NftMediaSize.Small:
                width = 'w-8'
                height = 'w-8'
                // squircle or circle
                radius = shape === 'squircle' ? 'lg' : 'full'
                padding = 2
                bgColor = 'gray-500'
                darkBgColor = 'gray-500'
                break
            case NftMediaSize.Medium:
                width = 'w-20'
                height = 'h-20'
                // squircle or circle
                radius = shape === 'squircle' ? 'xl' : 'full'
                padding = 2
                bgColor = 'gray-500'
                darkBgColor = 'gray-500'
                break
            case NftMediaSize.Large:
                width = 'w-60'
                height = 'h-60'
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                padding = 2
                bgColor = 'gray-200'
                darkBgColor = 'gray-700'
                break
            case NftMediaSize.ExtraLarge:
                width = 'w-96'
                height = 'h-96'
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                bgColor = 'gray-200'
                darkBgColor = 'gray-700'
                break
            case NftMediaSize.Flexible:
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                bgColor = 'gray-200'
                darkBgColor = 'gray-700'
                break
        }

        // if square remove radius
        radius = shape === 'square' ? 'none' : radius
    }

    let isLoaded = true

    function composeUrl(targetUrl: string): string {
        if (!targetUrl) {
            return undefined
        }
        const url = new URL(targetUrl)

        switch (url.protocol) {
            case 'http:':
                return targetUrl.replace('http:', 'https:')
            case 'https:':
                return targetUrl
            case 'ipfs:':
                return rewriteIpfsUri(targetUrl)
            default:
                return undefined
        }
    }

    function handleImageError() {
        isLoaded = false
    }
</script>

<div
    class="overflow-hidden flex justify-center items-center transition-none flex-shrink-0 p-{padding} bg-{bgColor} dark:bg-{darkBgColor} {width} {height} rounded-{radius} {classes}"
>
    {#if !isLoaded}
        <NftPlaceholderIcon {nft} {size} {bgColor} {darkBgColor} />
    {:else if nft.parsedMetadata.type.startsWith('image')}
        <img
            src={composeUrl(nft.parsedMetadata.uri)}
            on:error={handleImageError}
            class="object-cover w-full h-full"
            alt={`Media for ${nft.name}`}
        />
    {:else if nft.parsedMetadata.type.startsWith('video')}
        <video
            src={composeUrl(nft.parsedMetadata.uri)}
            class="object-cover w-full h-full"
            alt={`Media for ${nft.name}`}
            autoplay
            loop
            muted
        />
    {:else}
        <NftPlaceholderIcon {nft} {size} {bgColor} {darkBgColor} />
    {/if}
</div>
