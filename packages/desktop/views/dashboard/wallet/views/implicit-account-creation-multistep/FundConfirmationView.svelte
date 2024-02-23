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
        getBicWalletBalance,
    } from '@core/wallet'
    import { activeProfile } from '@core/profile'
    import { Balance } from '@iota/sdk/out/types'
    import { getManaBalance } from '@core/network'

    // TODO: use this output to calculate mana
    export let outputId: string | undefined

    let walletBalance: Balance | undefined
    let bicBalance: number

    $: totalBalanceWithoutBic = getManaBalance(walletBalance?.mana?.total)
    $: availableBalance = getManaBalance(walletBalance?.mana?.available)
    $: allImplicitAccountsManaExceptThis = availableBalance - totalBalanceWithoutBic
    $: generatedMana = totalBalanceWithoutBic + bicBalance - allImplicitAccountsManaExceptThis
    $: formattedWalletBalance = walletBalance?.baseCoin?.available
        ? formatTokenAmountBestMatch(Number(walletBalance?.baseCoin?.available), baseCoin?.metadata)
        : '-'
    $: ({ baseCoin } = $selectedWalletAssets?.[$activeProfile?.network?.id] ?? {})

    function getOutputAmount(): string {
        let amount: string
        if (outputId) {
            amount = $selectedWallet?.implicitAccountOutputs.find(
                (implicitAccounts) => implicitAccounts.outputId.toString() === outputId
            )?.output.amount
        } else {
            amount = $selectedWallet?.implicitAccountOutputs?.[0]?.output.amount
        }
        return baseCoin ? formatTokenAmountBestMatch(Number(amount), baseCoin?.metadata) : ''
    }

    onMount(async () => {
        walletBalance = await $selectedWallet.getBalance()
        bicBalance = await getBicWalletBalance($selectedWalletId)
        startCountdown()
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
                    valueText={generatedMana.toString()}
                />
            </div>
        </div>
        <Button disabled>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
    </div>
</step-content>
