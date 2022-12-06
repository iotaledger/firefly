<script lang="typescript">
    import { INft, ParentMimeType } from '@core/nfts'
    import { Icon, NftMediaSize } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { appSettings } from '@core/app'

    export let nft: INft = undefined
    export let size: NftMediaSize

    const width = '125%'
    const height = '125%'

    $: primaryColor = $appSettings.darkMode ? '#9AADCE' : '#F0F5FE'
    $: secondaryColor = $appSettings.darkMode ? '#9AADCE' : '#D8E3F5'

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

<Icon
    {icon}
    {width}
    {height}
    {primaryColor}
    {secondaryColor}
    classes="bg-gray-100 text-white dark:text-gray-800 text-center"
/>
