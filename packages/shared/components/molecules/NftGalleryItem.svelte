<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMediaContainer, NftMediaSize } from 'shared/components'

    export let nft: INft
    export let onClick: () => void = () => {}
</script>

<button on:click={onClick} style="height: 300px; width: 240px;">
    <NftMediaContainer nftId={nft.id} size={NftMediaSize.Large} classes="rounded-b-none" />
    <div class="description w-full flex flex-col justify-center p-3 bg-gray-50">
        <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
    </div>
</button>
