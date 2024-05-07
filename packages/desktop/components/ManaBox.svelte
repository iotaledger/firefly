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
    export let outputId: string | undefined = undefined

    const NUMBER_OF_EXTRA_SLOTS_MANA = 3
    const extraMana: number = 0 // the sdk returns the wait time without extra slots
    // const extraMana: number = getExtraMana(NUMBER_OF_EXTRA_SLOTS_MANA)

    let estimatedManaCost: number | undefined = undefined
    let refreshManaCountdownInterval: NodeJS.Timeout
    let secondsRemainingCountdownInterval: NodeJS.Timeout
    let secondsToRefreshManaCost = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT
    let secondsRemaining: number = 0

    let errorMessage: string = ''

    $: (transactionInfo?.preparedTransaction || transactionInfo?.preparedTransactionError) && calculateManaCost()
    $: mana = ($selectedWalletAssets?.[$activeProfile?.network?.id] ?? {}).mana
    $: availableMana = outputId
        ? getTotalAvailableMana($selectedWallet, outputId)
        : $selectedWallet?.balances?.availableManaToUse

    // When the transaction is succesfully prepared, we can know the mana cost
    let requiredMana: number | undefined = undefined
    $: requiredMana = estimatedManaCost ? estimatedManaCost + extraMana : undefined
    // When the transaction is not succesfully prepared, we can only know how much we need to generate
    let manaToGenerate: number | undefined = undefined

    // When making a transaction, the account output is spent and there is a time where the available mana is 0 until the new account output is received
    $: hasEnoughMana = availableMana && !$selectedWallet?.isTransferring && !transactionInfo?.preparedTransactionError
    $: timeRemaining = secondsRemaining ? getBestTimeDuration(secondsRemaining * MILLISECONDS_PER_SECOND) : null

    function calculateManaCost(): void {
        if (transactionInfo?.preparedTransactionError) {
            if (transactionInfo.preparedTransactionError.message?.includes('slots remaining until enough mana')) {
                estimatedManaCost = undefined
                errorMessage = ''

                const splittedError = transactionInfo.preparedTransactionError.message?.split(' ')
                const requiredManaFromError = splittedError[splittedError.indexOf('required') + 1]?.replace(',', '')
                const foundManaFromError = splittedError[splittedError.indexOf('found') + 1]?.replace(',', '')
                manaToGenerate = Number(requiredManaFromError) - Number(foundManaFromError)

                const slotsRemaining = Number(splittedError.reverse()[0].replace('`', ''))
                if (slotsRemaining && secondsRemaining === 0) {
                    secondsRemaining = slotsRemaining * DEFAULT_SECONDS_PER_SLOT
                    secondsRemainingCountdownInterval = setInterval(() => {
                        secondsRemaining -= 1
                        if (secondsRemaining <= 0) {
                            clearInterval(secondsRemainingCountdownInterval)
                        }
                    }, MILLISECONDS_PER_SECOND)
                }
            }
            if (
                transactionInfo.preparedTransactionError.message?.includes(
                    'insufficient amount to generate positive mana'
                )
            ) {
                manaToGenerate = undefined
                estimatedManaCost = undefined
                errorMessage = localize('general.insufficientManaGeneration')
            }
        } else if (transactionInfo?.preparedTransaction) {
            errorMessage = ''
            manaToGenerate = undefined
            estimatedManaCost =
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
    {#if !errorMessage}
        {#if requiredMana > extraMana}
            <KeyValueBox
                keyText={localize('general.manaCost')}
                valueText={formatTokenAmountBestMatch(requiredMana, mana.metadata)}
            />
        {/if}
        {#if !hasEnoughMana && timeRemaining}
            <Text type={TextType.p} error classes="text-center">
                {localize('general.insufficientMana', {
                    values: {
                        mana: formatTokenAmountBestMatch(manaToGenerate, mana.metadata),
                        time: timeRemaining,
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
    {:else}
        <Text type={TextType.p} error classes="self-center max-w-sm w-full">
            {errorMessage}
        </Text>
    {/if}
</div>
