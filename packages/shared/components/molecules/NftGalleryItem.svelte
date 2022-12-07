<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight, NftMediaContainer, NftMediaSize } from 'shared/components'

    export let nft: INft
    export let onClick: () => void = () => {}
</script>

<button on:click={onClick}>
    <NftMediaContainer nftId={nft.id} size={NftMediaSize.Flexible} classes="rounded-b-none max-h-72" />
    <div class="description w-full flex flex-col justify-center p-3.5 bg-white dark:bg-gray-800 rounded-b-2xl">
        <Text fontWeight={FontWeight.semibold} fontSize="12" classes="text-left truncate">{nft.name}</Text>
    </div>
</button>
