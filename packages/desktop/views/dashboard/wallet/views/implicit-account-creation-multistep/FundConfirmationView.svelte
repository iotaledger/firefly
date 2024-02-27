<script lang="ts">
    import { localize } from '@core/i18n'
    import { getManaBalance, getPassiveManaForOutput } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { implicitAccountCreationRouter } from '@core/router'
    import { formatTokenAmountBestMatch, selectedWallet, selectedWalletAssets } from '@core/wallet'
    import { OutputData } from '@iota/sdk'
    import { Button, FontWeight, KeyValueBox, Text, TextType } from '@ui'
    import { onDestroy, onMount } from 'svelte'

    export let outputId: string | undefined

    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin

    let selectedOutput: OutputData
    $: $selectedWallet, (selectedOutput = getSelectedOutput())

    let totalAvailableMana: number
    $: $selectedWallet, seconds, (totalAvailableMana = getTotalAvailableMana())

    let formattedSelectedOutputBlance: string
    $: selectedOutput,
        (formattedSelectedOutputBlance = baseCoin
            ? formatTokenAmountBestMatch(Number(selectedOutput?.output.amount), baseCoin.metadata)
            : '-')
    $: formattedWalletBalance =
        $selectedWallet.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet.balances.baseCoin.available), baseCoin.metadata)
            : '-'

    function getSelectedOutput(): OutputData {
        return (
            $selectedWallet?.implicitAccountOutputs.find(
                (implicitAccounts) => implicitAccounts.outputId.toString() === outputId
            ) ?? $selectedWallet?.implicitAccountOutputs?.[0]
        )
    }

    function getTotalAvailableMana(): number {
        return (
            getManaBalance($selectedWallet?.balances?.mana?.available) +
            ($selectedWallet?.balances.blockIssuanceCredits ?? 0) -
            getImplicitAccountsMana($selectedWallet?.implicitAccountOutputs, [outputId])
        )
    }

    function getImplicitAccountsMana(implicitAccountOutputs: OutputData[], excludeIds: string[] | undefined): number {
        return implicitAccountOutputs.reduce((acc: number, outputData: OutputData) => {
            if (excludeIds && excludeIds.includes(outputData.outputId)) {
                const totalMana = getPassiveManaForOutput(outputData)
                return totalMana ? acc + totalMana : acc
            } else {
                return acc
            }
        }, 0)
    }

    // TODO: Replace this with proper time remaining
    // ----------------------------------------------------------------
    let seconds: number = 10
    let countdownInterval: NodeJS.Timeout
    let timeRemaining: string

    $: timeRemaining = `${seconds}s remaining`

    onMount(() => {
        countdownInterval = setInterval(() => {
            seconds -= 1

            if (seconds <= 0) {
                clearInterval(countdownInterval)
                onTimeout()
            }
        }, 1000)
    })

    onDestroy(() => {
        clearInterval(countdownInterval)
    })

    const onTimeout = () => {
        $implicitAccountCreationRouter.next()
    }
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
            <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400">
                {timeRemaining}
            </Text>
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>
                {localize('views.implicit-account-creation.steps.step2.view.title')}
                {formattedSelectedOutputBlance}
            </Text>
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
