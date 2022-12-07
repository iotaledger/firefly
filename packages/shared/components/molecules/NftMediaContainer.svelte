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
                width = 'w-6'
                height = 6
                // squircle or circle
                radius = shape === 'squircle' ? 'md' : 'full'
                padding = 1
                break
            case NftMediaSize.Small:
                width = 'w-8'
                height = 8
                // squircle or circle
                radius = shape === 'squircle' ? 'lg' : 'full'
                padding = 2
                break
            case NftMediaSize.Medium:
                width = 'w-20'
                height = 'h-20'
                // squircle or circle
                radius = shape === 'squircle' ? 'xl' : 'full'
                padding = 2
                break
            case NftMediaSize.Large:
                width = 'w-60'
                height = 'h-60'
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                padding = 2
                break
            case NftMediaSize.ExtraLarge:
                width = 'w-96'
                height = 'h-96'
                // squircle or circle
                radius = shape === 'squircle' ? '2xl' : 'full'
                break
            case NftMediaSize.Flexible:
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
    class="flex justify-center items-center transition-none p-{padding} bg-gray-500 {width} {height} rounded-{radius} {classes}"
>
    {#if !isLoaded}
        <NftPlaceholderIcon {nft} />
    {:else}
        <div>
            <!-- Loaded and Secure NFT Media  -->
        </div>
    {/if}
</div>
