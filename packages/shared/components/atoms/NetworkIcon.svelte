<script lang="ts">
    import { Icon } from '@ui'
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { NetworkId } from '@core/network'

    export let networkId: NetworkId
    export let height = 22
    export let width = 22
    export let outlined = true

    let backgroundColor: string
    let iconColor: string

    $: {
        switch (networkId) {
            case NetworkId.Iota:
                backgroundColor = 'black'
                iconColor = 'white'
                break
            case NetworkId.Shimmer:
                backgroundColor = 'shimmer-highlight'
                iconColor = 'black'
                break
            case NetworkId.Testnet:
                backgroundColor = 'gray-400'
                iconColor = 'black'
                break
            default:
                backgroundColor = ''
                iconColor = ''
        }
    }
</script>

<network-icon
    class="flex items-center justify-center p-0.5 rounded-full bg-{backgroundColor} {outlined
        ? 'ring-2 ring-white dark:ring-gray-900'
        : ''}"
>
    <Icon {height} {width} icon={NETWORK_ICON_SVG[networkId]} classes="text-{iconColor}" />
</network-icon>
