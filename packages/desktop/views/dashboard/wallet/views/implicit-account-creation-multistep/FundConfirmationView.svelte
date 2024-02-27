<script lang="ts">
    import { Button, FontWeight, KeyValueBox, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { implicitAccountCreationRouter } from '@core/router'
    import { onMount, onDestroy } from 'svelte'
    import {
        formatTokenAmountBestMatch,
        selectedWallet,
        selectedWalletId,
        selectedWalletAssets,
        syncBalance,
        getImplicitAccountsTotalManaExceptThis,
    } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { DEFAULT_SECONDS_PER_SLOT, getManaBalance } from '@core/network'
    import { MILLISECONDS_PER_SECOND } from '@core/utils'

    export let outputId: string | undefined

    let balanceInterval: NodeJS.Timeout

    $: selectedOutput =
        $selectedWallet?.implicitAccountOutputs.find(
            (implicitAccounts) => implicitAccounts.outputId.toString() === outputId
        ) ?? $selectedWallet?.implicitAccountOutputs?.[0]

    $: totalAvailableMana =
        getManaBalance($selectedWallet?.balances?.mana?.available) +
        ($selectedWallet?.balances.blockIssuanceCredits ?? 0) -
        getImplicitAccountsTotalManaExceptThis($selectedWallet?.implicitAccountOutputs, outputId)
    $: formattedWalletBalance =
        $selectedWallet.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet.balances.baseCoin.available), baseCoin.metadata)
            : '-'
    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin

    function getOutputAmount(): string {
        return baseCoin ? formatTokenAmountBestMatch(Number(selectedOutput.output.amount), baseCoin.metadata) : ''
    }

    const startIntervalBalance = () => {
        balanceInterval = setInterval(() => {
            syncBalance($selectedWalletId, true)
        }, DEFAULT_SECONDS_PER_SLOT * MILLISECONDS_PER_SECOND)
    }

    onMount(async () => {
        await syncBalance($selectedWalletId, true)
        startCountdown()
        startIntervalBalance()
    })

    // TODO: Replace this with proper time remaining
    // ----------------------------------------------------------------
    let seconds: number = 10
    let countdownInterval: NodeJS.Timeout
    let timeRemaining: string

    const startCountdown = () => {
        countdownInterval = setInterval(() => {
            seconds -= 1

            if (seconds <= 0) {
                clearInterval(countdownInterval)
                onTimeout()
            }
        }, 1000)
    }

    const onTimeout = () => {
        $implicitAccountCreationRouter.next()
    }

    onDestroy(() => {
        clearInterval(countdownInterval)
        clearInterval(balanceInterval)
    })
    $: timeRemaining = `${seconds}s remaining`
    // ----------------------------------------------------------------
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-20">
    <div class="flex flex-col h-full justify-between space-y-8">
        <div class="flex flex-col text-center space-y-4 max-w-md">
            <div class="flex items-center justify-center mb-7">
                <img
                    src="assets/illustrations/implicit-account-creation/step2.svg"
                    alt={localize('views.implicit-account-creation.steps.step2.title')}
                />
            </div>
            <Text
                type={TextType.h5}
                fontSize="15"
                color="blue-700"
                darkColor="blue-700"
                fontWeight={FontWeight.semibold}
                >{localize('views.implicit-account-creation.steps.step2.view.subtitle')}</Text
            >
            <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400"
                >{timeRemaining}</Text
            >
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}
                >{localize('views.implicit-account-creation.steps.step2.view.title')} {getOutputAmount()}</Text
            >
            <div class="flex flex-col space-y-2">
                <KeyValueBox
                    keyText={localize('views.implicit-account-creation.steps.step2.view.eyebrow')}
                    valueText={formattedWalletBalance}
                />
                <KeyValueBox
                    keyText={localize('views.implicit-account-creation.steps.step2.view.generatedMana')}
                    valueText={totalAvailableMana.toString()}
                />
            </div>
        </div>
        <Button disabled>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
    </div>
</step-content>
