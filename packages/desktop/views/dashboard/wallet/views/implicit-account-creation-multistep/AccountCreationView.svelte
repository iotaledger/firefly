<script lang="ts">
    import { Button, PasswordInput, LedgerAnimation, KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import {
        IWalletState,
        formatTokenAmountBestMatch,
        selectedWallet,
        selectedWalletAssets,
        selectedWalletId,
    } from '@core/wallet'
    import { Icon } from '@auxiliary/icon'
    import { LedgerAppName, ledgerAppName } from '@core/ledger'
    import { IllustrationEnum } from '@auxiliary/illustration'
    import { unlockStronghold, updateActiveWallet, isSoftwareProfile, activeProfile } from '@core/profile'
    import { OutputData, OutputId } from '@iota/sdk/out/types'
    import {
        DEFAULT_MANA,
        ITransactionInfoToCalculateManaCost,
        getAccountOutputsMana,
        getTotalAvailableMana,
    } from '@core/network'
    import { ManaBox } from '@components'

    export let outputId: string | undefined

    let error = ''
    let isBusy = false
    let strongholdPassword = ''
    let totalAvailableMana: number
    let hasEnoughMana = false
    const transactionInfo: ITransactionInfoToCalculateManaCost = {}

    $: baseCoin = $selectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin
    $: selectedOutput = getSelectedOutput($selectedWallet, outputId)
    $: validStronghold = $isSoftwareProfile ? strongholdPassword && strongholdPassword.length !== 0 : true
    $: disabledActive = !validStronghold || isBusy
    $: iconNetwork = $ledgerAppName === LedgerAppName.Shimmer ? Icon.Shimmer : Icon.Iota
    $: $selectedWallet, (totalAvailableMana = getTotalAvailableMana($selectedWallet, selectedOutput?.outputId))
    $: generatedManaToTransitionAccount = totalAvailableMana - getAccountOutputsMana($selectedWallet?.accountOutputs)
    $: formattedManaBalance = generatedManaToTransitionAccount
        ? formatTokenAmountBestMatch(Number(generatedManaToTransitionAccount), DEFAULT_MANA)
        : '-'
    $: formattedWalletBalance =
        $selectedWallet?.balances?.baseCoin?.available && baseCoin
            ? formatTokenAmountBestMatch(Number($selectedWallet?.balances.baseCoin.available), baseCoin.metadata)
            : null

    $: $selectedWallet, prepareTransaction(selectedOutput?.outputId)

    function getSelectedOutput(_selectedWallet: IWalletState, _outputId: string | undefined): OutputData | undefined {
        return (
            _selectedWallet?.implicitAccountOutputs.find(
                (implicitAccounts) => implicitAccounts.outputId.toString() === _outputId
            ) ?? _selectedWallet?.implicitAccountOutputs?.[0]
        )
    }

    async function unlockWalletAndCreateAccount(): Promise<void> {
        isBusy = true
        error = ''
        try {
            if ($selectedWallet?.implicitAccountOutputs.length === 0) return

            if ($isSoftwareProfile) {
                if (!strongholdPassword) return
                await unlockStronghold(strongholdPassword)
            }

            let outputIdForTransition: OutputId
            if (outputId) {
                outputIdForTransition = $selectedWallet?.implicitAccountOutputs.find(
                    (implicitAccounts) => implicitAccounts.outputId.toString() === outputId
                )?.outputId
            } else {
                outputIdForTransition = $selectedWallet?.implicitAccountOutputs[0].outputId
            }
            await $selectedWallet?.implicitAccountTransition(outputIdForTransition)
            updateActiveWallet($selectedWalletId, {
                hasImplicitAccountCreationTransactionInProgress: true,
                isTransferring: true,
            })
        } catch (err) {
            console.error('err', err)
            error = localize(err?.message ?? err)
            isBusy = false
        }
    }

    async function prepareTransaction(outputId: string): Promise<void> {
        try {
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareImplicitAccountTransition(outputId)
        } catch (error) {
            console.error(error)
            transactionInfo.preparedTransactionError = error
        }
    }
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-20">
    <div class="flex flex-col h-full justify-between space-y-8">
        <div class="flex flex-col text-center justify-center px-4 space-y-9 max-w-md">
            {#if $isSoftwareProfile}
                <div class="flex items-center justify-center">
                    <img
                        src="assets/illustrations/implicit-account-creation/step3.svg"
                        alt={localize('views.implicit-account-creation.steps.step3.title')}
                    />
                </div>
                <div class="flex flex-col space-y-2">
                    {#if formattedWalletBalance}
                        <KeyValueBox
                            keyText={localize('views.implicit-account-creation.steps.step2.view.eyebrow')}
                            valueText={formattedWalletBalance}
                        />
                    {/if}
                    <KeyValueBox
                        keyText={localize('views.implicit-account-creation.steps.step2.view.generatedMana')}
                        valueText={formattedManaBalance}
                    />
                    <ManaBox
                        {transactionInfo}
                        bind:hasEnoughMana
                        showCountdown={!$selectedWallet.isTransferring}
                        refreshTransactionInfo={() => prepareTransaction(selectedOutput?.outputId)}
                    />
                </div>
                <PasswordInput
                    bind:error
                    bind:value={strongholdPassword}
                    autofocus
                    showRevealToggle
                    submitHandler={unlockWalletAndCreateAccount}
                    placeholder={localize('views.implicit-account-creation.steps.step3.view.placeholder')}
                    disabled={$selectedWallet?.hasImplicitAccountCreationTransactionInProgress || isBusy}
                />
            {:else}
                <LedgerAnimation illustration={IllustrationEnum.LedgerConnected2Desktop} {iconNetwork} />
            {/if}
            <button-wrapper class="flex items-center justify-center">
                <Button onClick={unlockWalletAndCreateAccount} disabled={disabledActive} {isBusy}
                    >{localize('views.implicit-account-creation.steps.step2.view.action')}</Button
                >
            </button-wrapper>
        </div>
    </div>
</step-content>
