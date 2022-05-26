<script lang="typescript">
    import { Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { activities, ActivityAsyncStatus, ActivityDirection, ActivityStatus, Activity } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { onMount } from 'svelte'

    export let id: string

    let activity: Activity
    // TODO: Maybe we need a fresh fetch ofthe specified activity
    $: activity = $activities.find((a) => a.id === id)

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    let time = new Date()
    onMount(() => {
        if (activity.isAsync && !activity.isClaimed) {
            const interval = setInterval(() => {
                time = new Date()
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    })

    let asyncStatus: ActivityAsyncStatus
    $: asyncStatus = activity.getAsyncStatus(time)

    $: transactionDetails = {
        ...transactionDetails,
        type: activity.activityType,
        status: activity.confirmed ? ActivityStatus.Confirmed : ActivityStatus.Pending,
        asyncStatus,
        amount: activity.amount,
        recipient: activity.recipient,
        time: activity.time,
        expireDate: activity.expireDate,
    }
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transactionDetails.title')}</Text
    >
    <TransactionDetails {...transactionDetails} />
    <Button
        classes="w-full"
        secondary
        autofocus={false}
        onClick={() => Platform.openUrl(`${explorerUrl}/message/${id}`)}
    >
        <Text bigger color="blue-500">{localize('general.viewOnExplorer')}</Text>
    </Button>
</activity-details-popup>
