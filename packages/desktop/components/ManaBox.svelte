<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        DEFAULT_SECONDS_PER_SLOT,
        ITransactionInfoToCalculateManaCost,
        getExtraMana,
        getManaBalance,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { selectedWallet, formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { KeyValueBox, Text, TextType } from '@ui'
    import { onMount, onDestroy } from 'svelte'

    export let transactionInfo: ITransactionInfoToCalculateManaCost
    export let hasEnoughMana: boolean
    export let showCountdown: boolean = true

    const NUMBER_OF_EXTRA_SLOTS_MANA = 3
    const extraMana: number = getExtraMana(NUMBER_OF_EXTRA_SLOTS_MANA)

    let requiredTxManaCost: number = 0
    let secondsRemaining: number = 0
    let countdownInterval: NodeJS.Timeout
    let secondsToRefreshManaCost = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT

    $: (transactionInfo?.preparedTransaction || transactionInfo?.preparedTransactionError) && calculateManaCost()
    $: mana = ($selectedWalletAssets?.[$activeProfile?.network?.id] ?? {}).mana
    $: availableMana = getManaBalance($selectedWallet?.balances?.mana?.available)
    $: requiredMana = requiredTxManaCost + extraMana
    $: hasEnoughMana = availableMana >= requiredMana

    function calculateManaCost() {
        if (
            transactionInfo?.preparedTransactionError &&
            transactionInfo.preparedTransactionError.message?.includes('slots remaining until enough mana')
        ) {
            const splittedError = transactionInfo.preparedTransactionError.message?.split(' ')

            const requiredManaForTransaction = splittedError[splittedError.indexOf('required') + 1]?.replace(',', '')
            requiredTxManaCost = Number(requiredManaForTransaction ?? 0)

            const slotsRemaining = Number(splittedError.reverse()[0].replace('`', ''))
            secondsRemaining = slotsRemaining * DEFAULT_SECONDS_PER_SLOT
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
        countdownInterval = setInterval(() => {
            secondsToRefreshManaCost -= 1
            if (secondsToRefreshManaCost <= 0) {
                calculateManaCost()
                secondsToRefreshManaCost = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT
            }
        }, MILLISECONDS_PER_SECOND)
    })

    onDestroy(() => {
        clearInterval(countdownInterval)
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
                    availableMana,
                    secondsRemaining,
                },
            })}
        </Text>
    {/if}
    {#if showCountdown}
        <Text type={TextType.p} classes="text-center">
            {localize('general.secondsToRefreshManaCost', {
                values: {
                    seconds: secondsToRefreshManaCost,
                },
            })}
        </Text>
    {/if}
</div>
