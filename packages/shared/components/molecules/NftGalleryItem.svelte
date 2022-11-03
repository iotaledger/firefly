<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMediaContainer, NftMediaSize } from 'shared/components'

    export let nft: INft
    export let onClick: () => void = () => {}
</script>

<button on:click={onClick} style="height: 300px;">
    <NftMediaContainer nftId={nft.id} size={NftMediaSize.Large} />
    <div class="description w-full flex flex-col justify-center p-3">
        <Text weight={FontWeight.normal} fontSize="12" classes="text-left"
            >{nft.parsedMetadata?.collectionName ?? 'Collection'}</Text
        >
    </div>
</button>
