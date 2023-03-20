<script lang="ts">
    import MediaPlaceholder from './MediaPlaceholder.svelte'
    import { MediaDisplay } from 'shared/components'

    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts, INft, selectedAccountNfts } from '@core/nfts'

    export let nftId: string
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let loop: boolean = false
    export let muted: boolean = false
    export let classes: string = ''

    const bgColor = 'gray-200'
    const darkBgColor = 'gray-700'

    let nft: INft
    $: $selectedAccountNfts, (nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId))
</script>

{#if !nft?.composedUrl || !nft.downloadMetadata.isLoaded}
    <slot name="placeholder">
        <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} />
    </slot>
{:else}
    <MediaDisplay
        filePath={nft.filePath}
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
