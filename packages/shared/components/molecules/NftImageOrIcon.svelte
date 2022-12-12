<script lang="typescript">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { NftMedia, MediaIcon } from 'shared/components'

    export let nftId: string
    export let size: 'small' | 'medium' | 'large' = 'medium'

    let isLoaded = false
    let hasError = false
    let isIcon = false

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
    $: type = nft?.parsedMetadata?.type
    $: parentType = type?.split('/')?.[0]
    $: nftId, resetProps()
    $: isIcon = parentType !== 'image' || !isLoaded || hasError

    function resetProps() {
        isLoaded = false
        hasError = false
        isIcon = false
    }

    function handleLoadingError() {
        hasError = true
    }

    function handleOnLoad() {
        isLoaded = true
    }
</script>

<div
    class="
        flex overflow-hidden flex-shrink-0 rounded-md bg-gray-500 items-center justify-center
        {size === 'small' && 'w-6 h-6'}
        {size === 'medium' && 'w-8 h-8'}
        {size === 'large' && 'w-10 h-10'}
        {isIcon && size === 'small' && 'p-1'}
        {isIcon && size === 'medium' && 'p-2'}
        {isIcon && size === 'large' && 'p-3'}
    "
>
    {#if isIcon}
        <MediaIcon {type} />
    {:else}
        <NftMedia
            {nftId}
            classes="min-w-full min-h-full object-cover"
            onError={handleLoadingError}
            onLoad={handleOnLoad}
        />
    {/if}
</div>
