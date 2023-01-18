<script lang="typescript">
    import { Button, Text, TextHint, AssetAmountInput } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { convertToRawAmount, visibleSelectedAccountAssets } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup/actions'
    import { popupState } from '@auxiliary/popup/stores'
    import { hasToRevote } from '@contexts/governance/stores'
    import { onMount } from 'svelte'
    import { modifyPopupState } from '@auxiliary/popup/helpers'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const asset = $visibleSelectedAccountAssets?.baseCoin

    let assetAmountInput: AssetAmountInput
    let rawAmount = $selectedAccount?.votingPower
    let amount: number

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: disabled = $hasToRevote || $selectedAccount?.isTransferring
    $: confirmDisabled = isConfirmDisabled(amount)

    function isConfirmDisabled(sliderAmount: number): boolean {
        if (disabled) {
            return true
        }

        if (!sliderAmount) {
            return true
        }

        const convertedSliderAmount = convertToRawAmount(sliderAmount.toString(), 'SMR', asset?.metadata).toString()
        return convertedSliderAmount === $selectedAccount?.votingPower
    }

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

    onMount(async () => {
        disabled = true
        try {
            await _onMount()
            if ($hasToRevote) {
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
            bind:amount
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
        <Button type={HTMLButtonType.Submit} disabled={confirmDisabled} isBusy={disabled} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
