<script lang="typescript">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { NftMedia, MediaIcon } from 'shared/components'

    export let nftId: string
    export let classes: string = ''
    export let isIcon: boolean = false

    let isLoaded = true
    let hasError = false

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
    $: type = nft?.parsedMetadata?.type
    $: parentType = type?.split('/')?.[0]
    $: nftId, resetProps()
    $: isIcon = parentType !== 'image' || !isLoaded || hasError

    function resetProps() {
        isLoaded = true
        hasError = false
    }

    function handleLoadingError() {
        hasError = true
    }
</script>

{#if isIcon}
    <MediaIcon {type} />
{:else}
    <NftMedia {nftId} {classes} onError={handleLoadingError} />
{/if}
