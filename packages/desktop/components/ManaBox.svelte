<script lang="ts">
    import { localize } from '@core/i18n'
    import { DEFAULT_SECONDS_PER_SLOT, getExtraMana, getManaBalance } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'
    import { selectedWallet, formatTokenAmountBestMatch, selectedWalletAssets } from '@core/wallet'
    import { PreparedTransaction } from '@iota/sdk/out/types'
    import { KeyValueBox, Text, TextType } from '@ui'
    import { onMount, onDestroy } from 'svelte'

    export let preparedTransaction: PreparedTransaction | undefined
    export let hasEnoughMana: boolean
    export let showCountdown: boolean = true

    const NUMBER_OF_EXTRA_SLOTS_MANA = 3

    let allotmentManaCost: number = 0
    let countdownInterval: NodeJS.Timeout
    let extraMana: number = getExtraMana(NUMBER_OF_EXTRA_SLOTS_MANA)
    let secondsToRefreshExtraMana = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT

    $: preparedTransaction && calculateAndSetManaCost() // updates mana values when preparedTransaction changes
    $: mana = ($selectedWalletAssets?.[$activeProfile?.network?.id] ?? {}).mana
    $: availableMana = getManaBalance($selectedWallet?.balances?.mana?.available)
    $: hasEnoughMana = availableMana >= requiredMana
    $: requiredMana = allotmentManaCost + extraMana

    function calculateAndSetManaCost(): void {
        allotmentManaCost =
            preparedTransaction?._preparedData?.transaction?.allotments?.reduce(
                (acc, { mana }) => acc + Number(mana),
                0
            ) || 0
        extraMana = getExtraMana(NUMBER_OF_EXTRA_SLOTS_MANA)
    }

    onMount(() => {
        calculateAndSetManaCost()
        countdownInterval = setInterval(() => {
            secondsToRefreshExtraMana -= 1
            if (secondsToRefreshExtraMana <= 0) {
                calculateAndSetManaCost()
                secondsToRefreshExtraMana = NUMBER_OF_EXTRA_SLOTS_MANA * DEFAULT_SECONDS_PER_SLOT
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

    <!-- TODO: Update with mana generation -->
    {#if !hasEnoughMana}
        <Text type={TextType.p} error classes="text-center">
            {localize('general.insufficientMana', {
                values: {
                    availableMana,
                },
            })}
        </Text>
    {/if}
    {#if showCountdown}
        <Text type={TextType.p} classes="text-center">
            {localize('general.secondsToRefreshManaCost', {
                values: {
                    seconds: secondsToRefreshExtraMana,
                },
            })}
        </Text>
    {/if}
</div>
