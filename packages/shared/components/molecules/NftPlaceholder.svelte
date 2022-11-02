<script lang="typescript">
    import { INft } from '@core/nfts'
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    type IconSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

    export let nft: INft
    export let size: IconSize = 'small'

    $: icon = mapNftToIcon(nft)
    $: iconStyle = setIconStyle(size)

    function mapNftToIcon(nft: INft): IconEnum {
        const nftType = nft?.parsedMetadata?.type

        if (!nftType) {
            return IconEnum.Help
        }

        if (nftType.startsWith('image')) {
            return IconEnum.Help
        } else if (nftType.startsWith('video')) {
            return IconEnum.Help
        } else if (nftType.startsWith('audio')) {
            return IconEnum.Help
        } else if (nftType.startsWith('model')) {
            return IconEnum.Help
        } else if (nftType.startsWith('application')) {
            return IconEnum.Help
        } else if (nftType.startsWith('text')) {
            return IconEnum.Help
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

    // WIP: Either create style object here for image or use conditionals in
    //      Svelte logic block below
    function setIconStyle(size: IconSize): { width: number } {
        let dimension: number

        if (size === 'extra-small') {
            dimension = 32
        } else if (size === 'small') {
            dimension = 89
        } else if (size === 'medium') {
            dimension = 160
        } else if (size === 'large') {
            dimension = 244
        } else if (size === 'extra-large') {
            dimension = 600
        }
        return {
            width: dimension,
        }
    }
</script>

<div>
    <Icon icon />
</div>
