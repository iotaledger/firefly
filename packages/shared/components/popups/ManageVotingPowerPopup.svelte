<script lang="typescript">
    import { Button, Text, TextHint, AssetAmountInput } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { popupState } from '@auxiliary/popup/stores'
    import { votingPowerTransactionState } from '@contexts/governance/stores'
    import { InclusionState } from '@iota/wallet/out/types'
    import { onMount } from 'svelte'
    import { modifyPopupState } from '@auxiliary/popup/helpers'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const asset = $visibleSelectedAccountAssets?.baseCoin

    let assetAmountInput: AssetAmountInput
    let rawAmount = $selectedAccount?.votingPower

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: $votingPowerTransactionState, openRevotePopupIfNecessary()
    $: disabled = $votingPowerTransactionState === InclusionState.Pending || $selectedAccount?.isTransferring
    $: disableConfirm = disabled || $selectedAccount?.votingPower === rawAmount

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate()
            await checkActiveProfileAuth(
                async () => {
                    await setVotingPower(rawAmount)
                },
                { stronghold: true, ledger: false }
            )
        } catch (err) {
            handleError(err)
            closePopup()
        }
    }

    function openRevotePopupIfNecessary(): void {
        if ($votingPowerTransactionState === InclusionState.Confirmed) {
            modifyPopupState({ ...$popupState, preventClose: false, hideClose: false }, true)
            openPopup({
                type: 'revote',
            })
        }
    }

    onMount(async () => {
        disabled = true
        try {
            await _onMount()
            if ($votingPowerTransactionState === InclusionState.Pending) {
                modifyPopupState({ ...$popupState, preventClose: true, hideClose: true })
            } else {
                disabled = false
            }
        } catch (err) {
            handleError(err)
        }
    })
</script>

<form id="manage-voting-power" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
    <Text type={TextType.p} secondary classes="mb-5">{localize('popups.manageVotingPower.body')}</Text>
    <div class="space-y-4 mb-6">
        <AssetAmountInput
            bind:this={assetAmountInput}
            bind:rawAmount
            {asset}
            containsSlider
            disableAssetSelection
            {disabled}
            {votingPower}
        />
        <TextHint info text={localize('popups.manageVotingPower.hint')} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" {disabled} onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button type={HTMLButtonType.Submit} disabled={disableConfirm} isBusy={disabled} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
