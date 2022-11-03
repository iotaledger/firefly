<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Text, FontWeight } from 'shared/components'

    export let nft: INft
    export let onClick: () => void = () => {}
</script>

<button class="nft-gallery-item" on:click={onClick}>
    <div class="image" />
    <div class="description w-full flex flex-col justify-center p-3">
        <Text weight={FontWeight.normal} fontSize="12" classes="text-left"
            >{nft.parsedMetadata?.collectionName ?? 'Collection'}</Text
        >
    </div>
</button>

<style lang="scss">
    .nft-gallery-item {
        width: 244px;
        height: 300px;

        .image {
            width: 100%;
            height: 244px;
            border-radius: 12px 12px 0px 0px;
            background-color: #dddddd;
        }
    }
</style>
