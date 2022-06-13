<script lang="typescript">
    import { Icon } from 'shared/components'
    import { NetworkProtocol } from '@core/network'

    export let networkProtocol: NetworkProtocol
    export let height = 22
    export let width = 22

    let backgroundColor
    let iconColor
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

<div
    class="p-0.5 flex items-center justify-center rounded-full border-2 border-solid border-white dark:border-gray-900 bg-{backgroundColor}"
>
    <Icon {height} {width} icon={networkProtocol} classes="text-{iconColor}" />
</div>
