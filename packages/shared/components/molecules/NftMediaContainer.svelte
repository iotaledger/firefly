<script lang="typescript">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
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
    $: size, setShapeAndSize()
    function setShapeAndSize(): void {
        switch (size) {
            case NftMediaSize.ExtraSmall:
                width = 6
                height = 6
                // squircle or circle
                radius = shape === 'squircle' ? 'md' : 'full'
                padding = 1
                break
            case NftMediaSize.Small:
                width = 8
                height = 8
                // squircle or circle
                radius = shape === 'squircle' ? 'lg' : 'full'
                padding = 2
                break
            case NftMediaSize.Medium:
                width = 20
                height = 20
                // squircle or circle
                radius = shape === 'squircle' ? 'xl' : 'full'
                padding = 2
                break
            case NftMediaSize.Large:
                width = 60
                height = 60
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                padding = 2
                break
            case NftMediaSize.ExtraLarge:
                width = 96
                height = 96
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                break
        }

        // if square remove radius
        radius = shape === 'square' ? 'none' : radius
    }

    const isLoaded = false
</script>

<div
    class="overflow-hidden flex justify-center items-center transition-none p-{padding} bg-gray-500 w-{width} h-{height} rounded-{radius} {classes}"
>
    {#if !isLoaded}
        <NftPlaceholderIcon {nft} {size} />
    {:else}
        <div>
            <!-- Loaded and Secure NFT Media  -->
        </div>
    {/if}
</div>
