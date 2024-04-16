<script lang="ts">
    import { Icon } from '@ui'
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { NetworkId } from '@core/network'

    export let networkId: NetworkId
    export let height: number = 22
    export let width: number = 22
    export let outlined: boolean = true

    $: backgroundColor = classesMap[networkId]?.backgroundColor ?? null
    $: iconColor = classesMap[networkId]?.iconColor ?? ''

    const classesMap: { [key in NetworkId]?: Record<string, string> } = {
        [NetworkId.Iota]: {
            backgroundColor: 'bg-black',
            iconColor: 'text-white',
        },
        [NetworkId.IotaTestnet]: {
            backgroundColor: 'bg-gray-400',
            iconColor: 'text-black',
        },
        [NetworkId.IotaAlphanet]: {
            backgroundColor: 'bg-gray-400',
            iconColor: 'text-black',
        },
        [NetworkId.Shimmer]: {
            backgroundColor: 'bg-shimmer-highlight',
            iconColor: 'text-black',
        },
        [NetworkId.ShimmerTestnet]: {
            backgroundColor: 'bg-gray-400',
            iconColor: 'text-black',
        },
    }
</script>

<network-icon class={backgroundColor} class:outlined>
    <Icon {height} {width} icon={NETWORK_ICON_SVG[networkId]} classes={iconColor} />
</network-icon>

<style lang="scss">
    network-icon {
        @apply flex items-center justify-center p-0.5 rounded-full;

        &.outlined {
            @apply ring-2 ring-white dark:ring-gray-900;
        }
    }
</style>
