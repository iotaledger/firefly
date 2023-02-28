<script lang="ts">
    import { Icon } from 'shared/components'
    import { NetworkProtocol } from '@core/network'

    export let networkProtocol: NetworkProtocol
    export let height = 22
    export let width = 22

    let backgroundColor: string
    let iconColor: string

    $: {
        switch (networkProtocol) {
            case NetworkProtocol.IOTA:
                backgroundColor = 'black'
                iconColor = 'white'
                break
            case NetworkProtocol.Shimmer:
                backgroundColor = 'shimmer-highlight'
                iconColor = 'black'
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
    <Icon {height} {width} icon={networkProtocol} classes="text-{iconColor}" />
</network-icon>
