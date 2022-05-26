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
    import { currencies, exchangeRates } from '@lib/currency'
    import { CurrencyTypes } from 'shared/lib/typings/currency'

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

    currencies
    $: formattedFiatValue = activity.getFiatAmount(
        $currencies[CurrencyTypes.USD],
        $exchangeRates[$activeProfile?.settings?.currency]
    )

    $: transactionDetails = {
        ...transactionDetails,
        type: activity.activityType,
        status: activity.confirmed ? ActivityStatus.Confirmed : ActivityStatus.Pending,
        asyncStatus,
        formattedFiatValue,
        rawAmount: activity.rawAmount,
        token: activity.token,
        recipient: activity.recipient,
        time: activity.time,
        expireDate: activity.expireDate,
    }

    // TODO
    function handleReject() {}

    // TODO
    function handleClaim() {}
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex flex-col">
        <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left">
            {localize('popups.transactionDetails.title')}
        </Text>
        <button
            class="action p-1 mr-1 w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={() => Platform.openUrl(`${explorerUrl}/message/${id}`)}
        >
            {localize('general.viewOnExplorer')}
        </button>
    </div>
    <TransactionDetails {...transactionDetails} />
    {#if activity.isAsync && activity.direction === ActivityDirection.In && asyncStatus === ActivityAsyncStatus.Unclaimed}
        <div class="flex w-full justify-between space-x-4">
            <button
                class="action p-4 w-full text-center font-medium text-15 text-blue-500 rounded-lg border border-solid border-gray-300"
                on:click={handleReject}
            >
                {localize('actions.reject')}
            </button>
            <button
                class="action p-4 w-full text-center rounded-lg font-medium text-15 bg-blue-500 text-white"
                on:click={handleClaim}
            >
                {localize('actions.claim')}
            </button>
        </div>
    {/if}
</activity-details-popup>
