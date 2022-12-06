<script lang="typescript">
    import { INft, ParentMimeType } from '@core/nfts'
    import { Icon, NftMediaSize } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let nft: INft = undefined
    export let size: NftMediaSize

    const width = '100%'
    const height = '100%'

    let iconSize: 'Small' | 'Large'
    $: iconSize = size === NftMediaSize.Large || size === NftMediaSize.ExtraLarge ? 'Large' : 'Small'
    $: icon = mapNftToIcon(nft, iconSize)

    function mapNftToIcon(nft: INft, iconSize: 'Small' | 'Large'): IconEnum {
        const nftType = nft?.parsedMetadata?.type?.split('/', 1)

        switch (nftType?.[0]) {
            case ParentMimeType.Image:
                return IconEnum[`CollectiblesImage${iconSize}`]
            case ParentMimeType.Video:
                return IconEnum[`CollectiblesVideo${iconSize}`]
            case ParentMimeType.Audio:
                return IconEnum[`CollectiblesAudio${iconSize}`]
            case ParentMimeType.Text:
                return IconEnum[`CollectiblesText${iconSize}`]
            case ParentMimeType.Application:
                return IconEnum[`CollectiblesApplication${iconSize}`]
            case ParentMimeType.Model:
                return IconEnum[`CollectiblesModel${iconSize}`]
            case ParentMimeType.Font:
                return IconEnum[`CollectiblesFont${iconSize}`]
            default:
                return IconEnum[`CollectiblesUnknown${iconSize}`]
        }
    }
</script>

<Icon {icon} {width} {height} classes="text-white dark:text-gray-800 text-center" />
