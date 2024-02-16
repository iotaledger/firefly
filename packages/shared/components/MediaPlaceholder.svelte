<script lang="ts">
    import { MimeType, ParentMimeType } from '@core/nfts'
    import { Icon } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { appSettings } from '@core/app'

    export let type: MimeType | undefined = undefined
    export let isDownloading: boolean = false
    export let iconOnly: boolean = false
    export let bgColor: string = 'bg-gray-500 dark:bg-gray-500'

    enum IconSize {
        Small = 'Small',
        Large = 'Large',
    }

    // primaryColor: gives extra color customization outside of default text colors, used in CollectiblesImageLarge to change mountain color
    $: primaryColor = $appSettings.darkMode ? '#25395F' : '#C4D1E8'
    // secondaryColor: alters the large icon's circle color
    $: secondaryColor = $appSettings.darkMode ? '#F0F5FE' : '#D8E3F5'

    $: icon = mapPropsToIcon(type as MimeType, iconOnly ? IconSize.Small : IconSize.Large)

    function mapPropsToIcon(type: MimeType, iconSize: IconSize.Small | IconSize.Large): IconEnum {
        const parentMimeType = type?.split('/', 1)?.[0]
        switch (parentMimeType) {
            case ParentMimeType.Image:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesImageLarge : IconEnum.CollectiblesImageSmall
            case ParentMimeType.Video:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesVideoLarge : IconEnum.CollectiblesVideoSmall
            case ParentMimeType.Audio:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesAudioLarge : IconEnum.CollectiblesAudioSmall
            case ParentMimeType.Text:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesTextLarge : IconEnum.CollectiblesTextSmall
            case ParentMimeType.Application:
                return iconSize === IconSize.Large
                    ? IconEnum.CollectiblesApplicationLarge
                    : IconEnum.CollectiblesApplicationSmall
            case ParentMimeType.Model:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesModelLarge : IconEnum.CollectiblesModelSmall
            case ParentMimeType.Font:
                return iconSize === IconSize.Large ? IconEnum.CollectiblesFontLarge : IconEnum.CollectiblesFontSmall
            default:
                return iconSize === IconSize.Large
                    ? IconEnum.CollectiblesUnknownLarge
                    : IconEnum.CollectiblesUnknownSmall
        }
    }
</script>

<Icon
    {icon}
    width="100%"
    height="100%"
    {primaryColor}
    {secondaryColor}
    classes={`text-white dark:text-gray-800 ${bgColor} text-center ${isDownloading ? 'animate-pulse' : ''}`}
/>
