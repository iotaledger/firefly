<script lang="ts">
    import { Network } from '@core/network'
    import { Icon } from 'shared/components'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let network: Network
    export let height = 22
    export let width = 22

    let backgroundColor: string
    let iconColor: string
    let icon: IconEnum

    $: {
        switch (network) {
            case Network.Iota:
                backgroundColor = 'black'
                iconColor = 'white'
                icon = IconEnum.Iota
                break
            case Network.Shimmer:
                backgroundColor = 'shimmer-highlight'
                iconColor = 'black'
                icon = IconEnum.Shimmer
                break
            case Network.Testnet:
                backgroundColor = 'gray-400'
                iconColor = 'black'
                icon = IconEnum.Shimmer
                break
            default:
                backgroundColor = ''
                iconColor = ''
        }
    }
</script>

<network-icon
    class="flex items-center justify-center p-0.5 rounded-full ring-2 ring-white dark:ring-gray-900 bg-{backgroundColor}"
>
    <Icon {height} {width} {icon} classes="text-{iconColor}" />
</network-icon>
