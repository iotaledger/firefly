<script lang="typescript">
    import { selectedAccountIndex } from '@core/account'
    import { getNftByIdFromAllAccountNfts, rewriteIpfsUri } from '@core/nfts'
    import { MediaDisplay } from 'shared/components'
    import MediaPlaceholder from './MediaPlaceholder.svelte'

    export let nftId: string
    export let autoplay: boolean = false
    export let controls: boolean = false
    export let classes: string = ''
    export let onError: () => unknown

    const bgColor = 'gray-200'
    const darkBgColor = 'gray-700'

    let isLoaded = true
    let hasError = false

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, nftId)
    $: url = composeUrl(nft?.parsedMetadata?.uri)

    $: nftId, resetProps()

    function resetProps() {
        isLoaded = true
        hasError = false
    }

    function composeUrl(targetUrl: string): string {
        if (!targetUrl) {
            return undefined
        }

        const url = new URL(targetUrl)
        let newUrl

        switch (url.protocol) {
            case 'http:':
                newUrl = targetUrl.replace('http:', 'https:')
                break
            case 'https:':
                newUrl = targetUrl
                break
            case 'ipfs:':
                newUrl = rewriteIpfsUri(targetUrl)
                break
            default:
                return undefined
        }

        if (nft?.parsedMetadata?.issuerName === 'Soonaverse') {
            return newUrl + '/' + nft?.parsedMetadata?.name
        } else {
            return newUrl
        }
    }

    function handleLoadingError() {
        if (onError) {
            onError()
        } else {
            hasError = true
        }
    }
</script>

{#if !onError && (!url || !isLoaded || hasError)}
    <MediaPlaceholder type={nft?.parsedMetadata?.type} {bgColor} {darkBgColor} />
{:else}
    <MediaDisplay
        src={url}
        expectedType={nft.parsedMetadata.type}
        alt={`Media display for ${nft.name}`}
        {autoplay}
        {controls}
        {classes}
        onError={handleLoadingError}
    />
{/if}
