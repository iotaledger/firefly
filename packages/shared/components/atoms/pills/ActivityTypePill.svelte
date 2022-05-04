<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityType } from '@lib/typings/activity'
    import Pill from './Pill.svelte'

    export let type: ActivityType

    let backgroundColor: string = 'gray-500'
    $: {
        switch (type) {
            case ActivityType.StakingTransaction:
                backgroundColor = 'gray-300'
                break
            case ActivityType.Transferring:
                backgroundColor = 'gray-200'
                break
            case ActivityType.Transfer:
                backgroundColor = 'gray-300'
                break
            case ActivityType.Sending:
                backgroundColor = 'lightblue-200'
                break
            case ActivityType.Sent:
                backgroundColor = 'lightblue-300'
                break
            case ActivityType.Receiving:
                backgroundColor = 'blue-200'
                break
            case ActivityType.Received:
                backgroundColor = 'blue-300'
                break
        }
    }
</script>

<Pill {backgroundColor}>
    {localize('general.' + type).toLowerCase()}
</Pill>
