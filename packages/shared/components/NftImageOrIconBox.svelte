<script lang="ts">
    import { INft } from '@core/nfts'
    import { NftSize } from 'shared/components/enums'
    import { MediaPlaceholder, NftMedia } from 'shared/components'
    import { ParentMimeType } from '@core/nfts'

    export let nft: INft | null = null
    export let size: NftSize = NftSize.Medium
    export let useCaching: boolean = true

    $: nftType = nft?.parsedMetadata?.type
    $: parentType = nftType?.split('/')?.[0]
</script>

<nft-image-or-icon-box
    class:bg-gray-500={!nft?.downloadMetadata?.isLoaded}
    class:small={size === NftSize.Small}
    class:medium={size === NftSize.Medium}
    class:large={size === NftSize.Large}
>
    {#if parentType === ParentMimeType.Image && nft}
        <NftMedia {nft} {useCaching}>
            <placeholder-wrapper
                slot="placeholder"
                class:small={size === NftSize.Small}
                class:medium={size === NftSize.Medium}
                class:large={size === NftSize.Large}
            >
                <MediaPlaceholder type={nftType} iconOnly />
            </placeholder-wrapper>
        </NftMedia>
    {:else}
        <placeholder-wrapper
            class:small={size === NftSize.Small}
            class:medium={size === NftSize.Medium}
            class:large={size === NftSize.Large}
        >
            <MediaPlaceholder type={nftType} iconOnly />
        </placeholder-wrapper>
    {/if}
</nft-image-or-icon-box>

<style lang="scss">
    nft-image-or-icon-box {
        @apply flex  items-center justify-center;
        @apply overflow-hidden;
        @apply shrink-0;
        @apply rounded-md;
        &.small {
            @apply w-6 h-6;
        }
        &.medium {
            @apply w-8 h-8;
        }
        &.large {
            @apply w-10 h-10;
        }
        placeholder-wrapper {
            @apply w-full h-full;
            &.small {
                @apply p-1;
            }
            &.medium,
            &.large {
                @apply p-2;
            }
        }
    }
</style>
