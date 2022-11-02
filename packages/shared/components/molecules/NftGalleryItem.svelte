<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, TextType, FontWeight } from 'shared/components'

    export let nft: INft
    export let onClick: () => void = () => {}
</script>

<button class="nft-gallery-item" on:click={onClick}>
    <div class="image rounded-lg" />
    <div class="description w-full flex flex-col justify-center">
        <Text wight={FontWeight.semibold} classes="text-left">{nft.parsedMetadata?.collectionName ?? 'Collection'}</Text
        >
        <Text type={TextType.pre} color="gray-500" classes="text-left">4 NFT</Text>
    </div>
</button>

<style lang="scss">
    .nft-gallery-item {
        width: 244px;
        height: 300px;

        .image {
            width: 100%;
            height: 244px;
            background-color: #dddddd;
        }

        .description {
            height: 58px;
        }
    }
</style>
