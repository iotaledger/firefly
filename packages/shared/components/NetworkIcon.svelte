<script lang="typescript">
    import { Icon } from 'shared/components'
    import { NetworkProtocol } from '@core/network'

    export let networkProtocol: NetworkProtocol
    export let height = 24
    export let width = 24

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

<div class="rounded-full border-3 border-solid border-white dark:border-gray-900 bg-{backgroundColor}">
    <Icon {height} {width} icon={networkProtocol} classes="text-{iconColor}" />
</div>
