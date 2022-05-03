<script lang="typescript">
    import { localize } from '@core/i18n'
    import { isParticipationPayload } from '@lib/wallet'
    import Pill from './Pill.svelte'

    export let activity
    export let confirmed

    enum ActivityType {
        StakingTransaction = 'stakingTransaction',
        Transfer = 'transfer',
        Transferring = 'transferring',
        Received = 'received',
        Sent = 'sent',
        Receiving = 'receiving',
        Sending = 'sending',
    }

    let type: ActivityType
    $: {
        if (activity) {
            if (isParticipationPayload(activity)) {
                type = ActivityType.StakingTransaction
            } else if (activity.data.essence.data.internal) {
                type = confirmed ? ActivityType.Transfer : ActivityType.Transferring
            } else {
                type = confirmed
                    ? activity.data.essence.data.incoming
                        ? ActivityType.Received
                        : ActivityType.Sent
                    : activity.data.essence.data.incoming
                    ? ActivityType.Receiving
                    : ActivityType.Sending
            }
        }
    }

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
