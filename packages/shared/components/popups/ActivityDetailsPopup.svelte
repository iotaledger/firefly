<script lang="typescript">
    import { Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { Platform } from 'shared/lib/platform'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { Activity, ActivityAsyncStatus, ActivityDirection, parseRawAmount } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { onMount } from 'svelte'
    import { currencies, exchangeRates } from '@lib/currency'
    import { CurrencyTypes } from 'shared/lib/typings/currency'

    export let activity: Activity

    let time = new Date()

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.networkProtocol, $activeProfile?.networkType)

    $: ({ amount, unit } = parseRawAmount(activity?.rawAmount, activity?.token))

    $: asyncStatus = activity.getAsyncStatus(time)

    $: formattedFiatValue = activity.getFiatAmount(
        $currencies[CurrencyTypes.USD],
        $exchangeRates[$activeProfile?.settings?.currency]
    )

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

    // TODO
    function handleReject() {}

    // TODO
    function handleClaim() {}

    function handleExplorerClick() {
        Platform.openUrl(`${explorerUrl}/block/${activity.id}`)
    }
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="flex flex-col">
        <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left">
            {localize('popups.transactionDetails.title')}
        </Text>
        <button
            class="action w-fit flex justify-start text-center font-medium text-14 text-blue-500"
            on:click={handleExplorerClick}
        >
            {localize('general.viewOnExplorer')}
        </button>
    </div>
    <TransactionDetails {asyncStatus} {formattedFiatValue} {amount} {unit} {...activity} />
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
