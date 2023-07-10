<script lang="ts">
    import { Icon } from '@ui'
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { NetworkId } from '@core/network'

    export let networkId: NetworkId
    export let height: number = 22
    export let width: number = 22
    export let outlined: boolean = true

    enum Color {
        Black = 'black',
        White = 'white',
        ShimmerHighlight = 'shimmer-highlight',
        Gray400 = 'gray-400',
    }

    let backgroundColor: string
    let iconColor: string

    $: {
        switch (networkId) {
            case NetworkId.Iota:
                backgroundColor = Color.Black
                iconColor = Color.White
                break
            case NetworkId.Shimmer:
                backgroundColor = Color.ShimmerHighlight
                iconColor = Color.Black
                break
            case NetworkId.Testnet:
                backgroundColor = Color.Gray400
                iconColor = Color.Black
                break
            default:
                backgroundColor = ''
                iconColor = ''
        }
    }

    function getBackgroundClasses(color: string): string {
        return color ? `bg-${color}` : ''
    }
</script>

<network-icon class={`${outlined ? 'outlined' : ''} ${getBackgroundClasses(backgroundColor)}`}>
    <Icon {height} {width} icon={NETWORK_ICON_SVG[networkId]} classes="text-{iconColor}" />
</network-icon>

<style lang="scss">
    network-icon {
        @apply flex items-center justify-center p-0.5 rounded-full;

        &.outlined {
            @apply ring-2 ring-white dark:ring-gray-900;
        }
    }
</style>
