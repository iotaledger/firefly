<script lang="ts">
    import { ManaBox } from '@components'
    import { localize } from '@core/i18n'
    import {
        DEFAULT_MANA,
        ITransactionInfoToCalculateManaCost,
        DEFAULT_SECONDS_PER_SLOT,
        getTotalAvailableMana,
    } from '@core/network'
    import { activeProfile, updateActiveWallet } from '@core/profile'
    import { implicitAccountCreationRouter } from '@core/router'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
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
    let totalAvailableMana: number
    let formattedSelectedOutputBalance: string

    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin
    $: selectedOutput = getSelectedOutput($selectedWallet, outputId)
    $: $selectedWallet,
        (totalAvailableMana = getTotalAvailableMana($selectedWallet, outputId)),
        prepareTransaction(selectedOutput?.outputId)
    $: selectedOutput,
        (formattedSelectedOutputBalance = baseCoin
            ? formatTokenAmountBestMatch(Number(selectedOutput?.output.amount), baseCoin.metadata)
            : '-')
    $: formattedWalletBalance =
        $selectedWallet?.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet?.balances.baseCoin.available), baseCoin.metadata)
            : null
    $: formattedManaBalance = totalAvailableMana
        ? formatTokenAmountBestMatch(Number(totalAvailableMana), DEFAULT_MANA)
        : '-'
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
                transactionInfo.preparedTransactionError = error
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
        <div class="flex flex-col text-center space-y-4 max-w-xl w-full">
            <div class={`flex items-center justify-center ${isLowManaGeneration ? 'mb-2' : 'mb-7'}`}>
                <img
                    src="assets/illustrations/implicit-account-creation/step2.svg"
                    alt={localize('views.implicit-account-creation.steps.step2.title')}
                />
            </div>
            {#if isCongestionNotFound}
                <div class="flex items-center justify-center space-x-2">
                    <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-600" darkColor="gray-400">
                        {localize('views.implicit-account-creation.steps.step2.view.calculating')}
                    </Text>
                    <Spinner size={16} />
                </div>
            {/if}
            <Text type={TextType.h3} fontWeight={FontWeight.semibold}>
                {localize('views.implicit-account-creation.steps.step2.view.title')}
                {formattedSelectedOutputBalance}
            </Text>
            {#if !isCongestionNotFound}
                {#if isLowManaGeneration}
                    <div class="flex flex-col space-y-2">
                        <CopyableBox clearBoxPadding value={walletAddress} isCopyable classes="w-full">
                            <TextHint
                                variant={TextHintVariant.Info}
                                text={localize(
                                    'views.implicit-account-creation.steps.step2.view.walletAddress.description'
                                )}
                                valuePre={walletAddress}
                            />
                        </CopyableBox>
                    </div>
                {/if}
                <div class="flex flex-col space-y-2">
                    {#if isLowManaGeneration && formattedWalletBalance}
                        <KeyValueBox
                            keyText={localize('views.implicit-account-creation.steps.step2.view.eyebrow')}
                            valueText={formattedWalletBalance}
                        />
                    {/if}
                    <KeyValueBox
                        keyText={localize('views.implicit-account-creation.steps.step2.view.generatedMana')}
                        valueText={formattedManaBalance}
                    />
                    <ManaBox {transactionInfo} bind:hasEnoughMana showCountdown={true} {outputId} />
                </div>
            {/if}
        </div>
        <Button disabled>{localize('views.implicit-account-creation.steps.step2.view.action')}</Button>
    </div>
</step-content>
