<script lang="ts">
    import { Pill } from '@ui'
    import { NetworkHealth } from '@core/network'
    import { localize } from '@core/i18n'

    export let status: NetworkHealth

    let backgroundColor = ''
    let textColor = ''
    $: {
        switch (status) {
            case NetworkHealth.Operational:
                backgroundColor = 'bg-green-100 dark:bg-green-100'
                textColor = 'green-800'
                break
            case NetworkHealth.Degraded:
                backgroundColor = 'bg-yellow-100 dark:bg-yellow-100'
                textColor = 'yellow-800'
                break
            case NetworkHealth.Disconnected:
            case NetworkHealth.Down:
                backgroundColor = 'bg-orange-100 dark:bg-orange-100'
                textColor = 'orange-800'
                break
        }
    }
</script>

<Pill {backgroundColor} {textColor}>
    • {localize(`pills.networkHealth.${status}`)}
</Pill>
