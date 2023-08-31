<script lang="ts">
    import { Pill } from 'shared/components'
    import { NetworkHealth } from '@core/network'
    import { localize } from '@core/i18n'

    export let status: NetworkHealth
    let backgroundColor = ''
    let darkBackgroundColor = ''
    let textColor = ''
    $: {
        switch (status) {
            case NetworkHealth.Operational:
                backgroundColor = 'green-100'
                darkBackgroundColor = 'green-100'
                textColor = 'green-800'
                break
            case NetworkHealth.Degraded:
                backgroundColor = 'yellow-100'
                darkBackgroundColor = 'yellow-100'
                textColor = 'yellow-800'
                break
            case NetworkHealth.Disconnected:
            case NetworkHealth.Down:
                backgroundColor = 'orange-100'
                darkBackgroundColor = 'orange-100'
                textColor = 'orange-800'
                break
        }
    }
</script>

<Pill {backgroundColor} {darkBackgroundColor} {textColor}>
    • {localize(`pills.networkHealth.${status}`)}
</Pill>
