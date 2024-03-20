<script lang="ts">
    import { ManaBox } from '@components'
    import { localize } from '@core/i18n'
    import { DEFAULT_MANA, getManaBalance, getPassiveManaForOutput } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { implicitAccountCreationRouter } from '@core/router'
    import { IWalletState, formatTokenAmountBestMatch, selectedWallet, selectedWalletAssets } from '@core/wallet'
    import { OutputData, PreparedTransaction } from '@iota/sdk/out/types'
    import { Button, FontWeight, KeyValueBox, Text, TextType, TextHint, TextHintVariant, CopyableBox } from '@ui'
    import { onDestroy, onMount } from 'svelte'

    export let outputId: string | undefined

    // TODO: update when mana generation is available
    const isLowManaGeneration = false
    let walletAddress: string = ''
    let preparedTransaction: PreparedTransaction
    let hasEnoughMana = false

    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin

    $: selectedOutput = getSelectedOutput($selectedWallet, outputId)

    let totalAvailableMana: number
    $: $selectedWallet, seconds, (totalAvailableMana = getTotalAvailableMana())

    let formattedSelectedOutputBlance: string
    $: selectedOutput,
        (formattedSelectedOutputBlance = baseCoin
            ? formatTokenAmountBestMatch(Number(selectedOutput?.output.amount), baseCoin.metadata)
            : '-')
    $: formattedWalletBalance =
        $selectedWallet?.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet?.balances.baseCoin.available), baseCoin.metadata)
            : '-'
    $: formattedManaBalance = totalAvailableMana
        ? formatTokenAmountBestMatch(Number(totalAvailableMana), DEFAULT_MANA)
        : '-'

    function getSelectedOutput(_selectedWallet: IWalletState, _outputId: string | undefined): OutputData | undefined {
        return (
            _selectedWallet?.implicitAccountOutputs.find(
                (implicitAccounts) => implicitAccounts.outputId.toString() === _outputId
            ) ?? _selectedWallet?.implicitAccountOutputs?.[0]
        )
    }

    function getTotalAvailableMana(): number {
        return (
            getManaBalance($selectedWallet?.balances?.mana?.available) +
            $selectedWallet?.balances.totalWalletBic -
            getImplicitAccountsMana($selectedWallet?.implicitAccountOutputs, [outputId])
        )
    }

    function getImplicitAccountsMana(implicitAccountOutputs: OutputData[], excludeIds: string[] | undefined): number {
        return implicitAccountOutputs?.reduce((acc: number, outputData: OutputData) => {
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

    onMount(async () => {
        walletAddress = await $selectedWallet?.address()
        $selectedWallet
            .prepareImplicitAccountTransition(selectedOutput.outputId)
            .then((prepareTx) => (preparedTransaction = prepareTx))
            .catch(() => {})
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

    const onTimeout = (): void => {
        $implicitAccountCreationRouter.next()
    }
    // ----------------------------------------------------------------
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-20">
    <div class="flex flex-col h-full justify-between space-y-8 items-center">
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
                    valueText={formattedManaBalance}
                />
                <ManaBox {preparedTransaction} bind:hasEnoughMana showCountdown={false} />
            </div>
        </div>
        {#if isLowManaGeneration}
            <div class="flex flex-col space-y-4 w-2/3">
                <TextHint
                    variant={TextHintVariant.Warning}
                    text={localize('views.implicit-account-creation.steps.step2.view.walletAddress.description')}
                />
                <CopyableBox value={walletAddress} isCopyable>
                    <Text
                        type={TextType.pre}
                        fontSize="13"
                        fontWeight={FontWeight.medium}
                        color="gray-900"
                        darkColor="white">{walletAddress}</Text
                    >
                </CopyableBox>
            </div>
        {/if}
        <Button disabled>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
    </div>
</step-content>
