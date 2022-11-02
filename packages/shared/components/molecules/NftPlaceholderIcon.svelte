<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let nft: INft = undefined
    export let width = '100%'
    export let height = '100%'
    // export let radius

    $: icon = mapNftToIcon(nft)

    function mapNftToIcon(nft: INft): IconEnum {
        const nftType = nft?.parsedMetadata?.type?.split('/', 1)

        switch (nftType?.[0]) {
            case 'image':
                return IconEnum.Picture
            case 'video':
                return IconEnum.Play
            case 'audio':
                return IconEnum.Bell
            case 'text':
                return IconEnum.Doc
            case 'application':
                return IconEnum.Parchment
            case 'model':
                return IconEnum.Help
            case 'font':
                return IconEnum.Language
            default:
                return IconEnum.Collectibles
        }
    }
</script>

<Icon {icon} {width} {height} classes="text-white dark:text-gray-800 text-center" />
