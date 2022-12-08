<script lang="typescript">
    import { INft, ParentMimeType } from '@core/nfts'
    import { Icon, NftMediaSize } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { appSettings } from '@core/app'

    export let nft: INft = undefined
    export let size: NftMediaSize
    export let bgColor = 'gray-500'
    export let darkBgColor = 'gray-500'

    const width = '100%'
    const height = '100%'

    // primaryColor: gives extra color customization outside of default text colors, used in CollectiblesImageLarge to change mountain color
    // secondaryColor: alters the large icon's circle color
    $: primaryColor = $appSettings.darkMode ? '#25395F' : '#C4D1E8'
    $: secondaryColor = $appSettings.darkMode ? '#F0F5FE' : '#D8E3F5'

    let iconSize: 'Small' | 'Large'
    $: iconSize =
        size === NftMediaSize.Large || size === NftMediaSize.ExtraLarge || size === NftMediaSize.Flexible
            ? 'Large'
            : 'Small'
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
    classes={`text-white dark:text-gray-800 bg-${bgColor} dark:bg-${darkBgColor} text-center`}
/>
