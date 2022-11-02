<script lang="typescript">
    import { INft, ParentMimeType } from '@core/nfts'
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let nft: INft = undefined

    const width = '100%'
    const height = '100%'

    $: icon = mapNftToIcon(nft)

    function mapNftToIcon(nft: INft): IconEnum {
        const nftType = nft?.parsedMetadata?.type?.split('/', 1)

        switch (nftType?.[0]) {
            case ParentMimeType.Image:
                return IconEnum.Picture
            case ParentMimeType.Video:
                return IconEnum.Play
            case ParentMimeType.Audio:
                return IconEnum.Bell
            case ParentMimeType.Text:
                return IconEnum.Doc
            case ParentMimeType.Application:
                return IconEnum.Parchment
            case ParentMimeType.Model:
                return IconEnum.Help
            case ParentMimeType.Font:
                return IconEnum.Language
            default:
                return IconEnum.Collectibles
        }
    }
</script>

<Icon {icon} {width} {height} classes="text-white dark:text-gray-800 text-center" />
