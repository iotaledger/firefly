<script lang="ts">
    import { localize } from '@core/i18n'
    import { DEFAULT_SECONDS_PER_SLOT, ITransactionInfoToCalculateManaCost, getTotalAvailableMana } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { MILLISECONDS_PER_SECOND, getBestTimeDuration } from '@core/utils'
    import { selectedWallet, formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { KeyValueBox, Text, TextType } from '@ui'
    import { onMount, onDestroy } from 'svelte'

    export let transactionInfo: ITransactionInfoToCalculateManaCost
    export let hasEnoughMana: boolean
    export let showCountdown: boolean = true
    export let outputId: string | undefined

    const NUMBER_OF_EXTRA_SLOTS_MANA = 3
    const extraMana: number = 0 // the sdk returns the wait time without extra slots
    // const extraMana: number = getExtraMana(NUMBER_OF_EXTRA_SLOTS_MANA)

    let requiredTxManaCost: number = 0
    let refreshManaCountdownInterval: NodeJS.Timeout
    let secondsRemainingCountdownInterval: NodeJS.Timeout
    let secondsToRefreshManaCost = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT
    let secondsRemaining: number = 10

    $: (transactionInfo?.preparedTransaction || transactionInfo?.preparedTransactionError) && calculateManaCost()
    $: mana = ($selectedWalletAssets?.[$activeProfile?.network?.id] ?? {}).mana
    $: availableMana = outputId
        ? getTotalAvailableMana($selectedWallet, outputId)
        : $selectedWallet?.balances?.availableManaToUse
    $: requiredMana = requiredTxManaCost + extraMana
    $: hasEnoughMana = availableMana >= requiredMana
    $: timeRemaining = getBestTimeDuration(secondsRemaining * MILLISECONDS_PER_SECOND)

    function calculateManaCost(): void {
        if (
            transactionInfo?.preparedTransactionError &&
            transactionInfo.preparedTransactionError.message?.includes('slots remaining until enough mana')
        ) {
            const splittedError = transactionInfo.preparedTransactionError.message?.split(' ')
            const requiredManaForTransaction = splittedError[splittedError.indexOf('required') + 1]?.replace(',', '')
            requiredTxManaCost = Number(requiredManaForTransaction ?? 0)

            const slotsRemaining = Number(splittedError.reverse()[0].replace('`', ''))
            if (slotsRemaining) {
                secondsRemaining = slotsRemaining * DEFAULT_SECONDS_PER_SLOT
                secondsRemainingCountdownInterval = setInterval(() => {
                    secondsRemaining -= 1
                    if (secondsRemaining <= 0) {
                        clearInterval(secondsRemainingCountdownInterval)
                    }
                }, MILLISECONDS_PER_SECOND)
            }
        } else if (transactionInfo?.preparedTransaction) {
            requiredTxManaCost =
                transactionInfo.preparedTransaction._preparedData?.transaction?.allotments?.reduce(
                    (acc, { mana }) => acc + Number(mana),
                    0
                ) || 0
        }
    }

    onMount(() => {
        calculateManaCost()
        refreshManaCountdownInterval = setInterval(() => {
            secondsToRefreshManaCost -= 1
            if (secondsToRefreshManaCost <= 0) {
                calculateManaCost()
                secondsToRefreshManaCost = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT
            }
        }, MILLISECONDS_PER_SECOND)
    })

    onDestroy(() => {
        clearInterval(refreshManaCountdownInterval)
        clearInterval(secondsRemainingCountdownInterval)
    })
</script>

<div class="flex flex-col space-y-2">
    <KeyValueBox
        keyText={localize('general.manaCost')}
        valueText={formatTokenAmountBestMatch(requiredMana, mana.metadata)}
    />

    {#if !hasEnoughMana}
        <Text type={TextType.p} error classes="text-center">
            {localize('general.insufficientMana', {
                values: {
                    timeRemaining,
                },
            })}
        </Text>
    {:else if showCountdown}
        <Text type={TextType.p} classes="text-center" color="gray-500" darkColor="gray-50">
            {localize('general.secondsToRefreshManaCost', {
                values: {
                    time: secondsToRefreshManaCost,
                },
            })}
        </Text>
    {/if}
</div>
