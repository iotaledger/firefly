<script lang="ts">
    import { ManaBox } from '@components'
    import { localize } from '@core/i18n'
    import {
        DEFAULT_MANA,
        ITransactionInfoToCalculateManaCost,
        getManaBalance,
        getPassiveManaForOutput,
        DEFAULT_SECONDS_PER_SLOT,
    } from '@core/network'
    import { activeProfile, updateActiveWallet } from '@core/profile'
    import { implicitAccountCreationRouter } from '@core/router'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, getBestTimeDuration } from '@core/utils'
    import { IWalletState, formatTokenAmountBestMatch, selectedWallet, selectedWalletAssets } from '@core/wallet'
    import { OutputData } from '@iota/sdk/out/types'
    import {
        Button,
        FontWeight,
        KeyValueBox,
        Text,
        TextType,
        TextHint,
        TextHintVariant,
        CopyableBox,
        Spinner,
    } from '@ui'
    import { onDestroy, onMount } from 'svelte'

    export let outputId: string | undefined

    const LOW_MANA_GENERATION_SECONDS = 10 * SECONDS_PER_MINUTE
    const transactionInfo: ITransactionInfoToCalculateManaCost = {}

    let walletAddress: string = ''
    let hasEnoughMana = false
    let isLowManaGeneration = false
    let isCongestionNotFound: boolean | null = null
    let seconds: number = 10
    let countdownInterval: NodeJS.Timeout
    let timeRemaining: string
    let totalAvailableMana: number
    let formattedSelectedOutputBalance: string

    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin
    $: selectedOutput = getSelectedOutput($selectedWallet, outputId)
    $: $selectedWallet, (totalAvailableMana = getTotalAvailableMana()), prepareTransaction(selectedOutput?.outputId)
    $: selectedOutput,
        (formattedSelectedOutputBalance = baseCoin
            ? formatTokenAmountBestMatch(Number(selectedOutput?.output.amount), baseCoin.metadata)
            : '-')
    $: formattedWalletBalance =
        $selectedWallet?.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet?.balances.baseCoin.available), baseCoin.metadata)
            : '-'
    $: formattedManaBalance = totalAvailableMana
        ? formatTokenAmountBestMatch(Number(totalAvailableMana), DEFAULT_MANA)
        : '-'
    $: timeRemaining = `${getBestTimeDuration(seconds * MILLISECONDS_PER_SECOND)} remaining`
    $: async () => {
        await prepareTransaction(selectedOutput.outputId)
    }

    $: if (isCongestionNotFound === false) startCountdown()

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
            ($selectedWallet?.balances.totalWalletBic ?? 0) -
            getImplicitAccountsMana($selectedWallet?.implicitAccountOutputs, outputId ? [outputId] : [])
        )
    }

    function getImplicitAccountsMana(implicitAccountOutputs: OutputData[], excludeIds: string[]): number {
        return implicitAccountOutputs?.reduce((acc: number, outputData: OutputData) => {
            if (excludeIds.length > 1 && !excludeIds.includes(outputData.outputId)) {
                const totalMana = getPassiveManaForOutput(outputData)
                return totalMana ? acc + totalMana : acc
            } else {
                return acc
            }
        }, 0)
    }

    async function prepareTransaction(outputId: string): Promise<void> {
        if (!outputId) return
        try {
            if ($selectedWallet) {
                transactionInfo.preparedTransaction = await $selectedWallet.prepareImplicitAccountTransition(outputId)
                updateActiveWallet($selectedWallet.id, {
                    hasEnoughManaToCreateExplicitAccount: { [outputId]: true },
                })
            }
            isCongestionNotFound = false
            seconds = 0 // If we don't get an error, it's because we can follow on to the next step
        } catch (error) {
            if (error.message?.includes('congestion was not found')) {
                isCongestionNotFound = true
                await $selectedWallet
                    ?.prepareImplicitAccountTransition(outputId)
                    .then(() => {
                        isCongestionNotFound = false
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
            if (error.message?.includes('slots remaining until enough mana')) {
                transactionInfo.preparedTransactionError = error.message
                const slotsRemaining = Number(error.message?.split(' ').reverse()[0].replace('`', ''))
                seconds = slotsRemaining * DEFAULT_SECONDS_PER_SLOT
                isLowManaGeneration = seconds >= LOW_MANA_GENERATION_SECONDS
                isCongestionNotFound = false
            }
        }
    }

    function startCountdown(): void {
        if (countdownInterval) clearInterval(countdownInterval)

        countdownInterval = setInterval(() => {
            seconds -= 1
            if (seconds <= 0) {
                clearInterval(countdownInterval)
                onTimeout()
            }
        }, MILLISECONDS_PER_SECOND)
    }

    onMount(() => {
        $selectedWallet?.address().then((address) => (walletAddress = address))
        if (seconds === 0) onTimeout()
    })

    onDestroy(() => {
        clearInterval(countdownInterval)
    })

    const onTimeout = (): void => {
        $implicitAccountCreationRouter.next()
    }
</script>

<step-content class={`flex flex-col items-center justify-between h-full ${isLowManaGeneration ? 'pt-8' : 'pt-20'}`}>
    <div class="flex flex-col h-full justify-between space-y-4 items-center">
        <div class="flex flex-col text-center space-y-4 max-w-md">
            <div class={`flex items-center justify-center ${isLowManaGeneration ? 'mb-2' : 'mb-7'}`}>
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
            {#if isCongestionNotFound}
                <div class="flex items-center justify-center space-x-2">
                    <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400">
                        {localize('views.implicit-account-creation.steps.step2.view.calculating')}
                    </Text>
                    <Spinner size={16} />
                </div>
            {:else if seconds > 0}
                <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400">
                    {timeRemaining}
                </Text>
            {/if}
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>
                {localize('views.implicit-account-creation.steps.step2.view.title')}
                {formattedSelectedOutputBalance}
            </Text>
            {#if isLowManaGeneration}
                <div class="flex flex-col space-y-2">
                    <KeyValueBox
                        keyText={localize('views.implicit-account-creation.steps.step2.view.eyebrow')}
                        valueText={formattedWalletBalance}
                    />
                    <KeyValueBox
                        keyText={localize('views.implicit-account-creation.steps.step2.view.generatedMana')}
                        valueText={formattedManaBalance}
                    />
                    <ManaBox {transactionInfo} bind:hasEnoughMana showCountdown={false} />
                </div>
            {/if}
        </div>
        {#if isLowManaGeneration}
            <div class="flex flex-col space-y-2 w-2/3">
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
