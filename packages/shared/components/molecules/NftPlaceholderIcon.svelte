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
                return IconEnum.CollectiblesImagePlaceholder
            case ParentMimeType.Video:
                return IconEnum.CollectiblesVideoPlaceholder
            case ParentMimeType.Audio:
                return IconEnum.CollectiblesAudioPlaceholder
            case ParentMimeType.Text:
                return IconEnum.CollectiblesTextPlaceholder
            case ParentMimeType.Application:
                return IconEnum.CollectiblesApplicationPlaceholder
            case ParentMimeType.Model:
                return IconEnum.CollectiblesModelPlaceholder
            case ParentMimeType.Font:
                return IconEnum.CollectiblesFontPlaceholder
            default:
                return IconEnum.CollectiblesUnknownPlaceholder
        }
    }
</script>

<Icon {icon} {width} {height} classes="text-white dark:text-gray-800 text-center" />
