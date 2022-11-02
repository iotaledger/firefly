<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let nft: INft = undefined
    $: icon = mapNftToIcon(nft)

    function mapNftToIcon(nft: INft): IconEnum {
        const nftType = nft?.parsedMetadata?.type

        if (!nftType) {
            return IconEnum.Collectibles
        }

        if (nftType.startsWith('image')) {
            return IconEnum.View
        } else if (nftType.startsWith('video')) {
            return IconEnum.Play
        } else if (nftType.startsWith('audio')) {
            return IconEnum.Bell
        } else if (nftType.startsWith('model')) {
            return IconEnum.Help
        } else if (nftType.startsWith('application')) {
            return IconEnum.Parchment
        } else if (nftType.startsWith('text')) {
            return IconEnum.Doc
        } else {
            return IconEnum.Help
        }

        // create a MimeType enum to match against?

        // switch (true) {
        //     case /^image/.test(nftType):
        //         return IconEnum.Help
        //     case /^video/.test(nftType):
        //         return IconEnum.Help
        //     case /^audio/.test(nftType):
        //         return IconEnum.Help
        //     case /^model/.test(nftType):
        //         return IconEnum.Help
        //     case /^application/.test(nftType):
        //         return IconEnum.Help
        //     case /^text/.test(nftType):
        //         return IconEnum.Help
        //     default:
        //         return IconEnum.Help
        // }
    }
</script>

<Icon {icon} width="100%" height="100%" classes="text-white dark:text-gray-800 text-center" />
