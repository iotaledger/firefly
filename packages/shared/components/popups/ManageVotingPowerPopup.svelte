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
    import { isSelectedAccountVoting } from '@contexts/governance'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let newVotingPower: string = undefined

    let assetAmountInput: AssetAmountInput
    let amount: number
    let rawAmount = newVotingPower ?? $selectedAccount?.votingPower
    let confirmDisabled = false
    let isVoting: boolean

    $: asset = $visibleSelectedAccountAssets?.baseCoin
    $: disabled = $hasToRevote || $selectedAccount?.isTransferring
    $: amount, disabled, setConfirmDisabled()

    function setConfirmDisabled(): void {
        if (disabled || !amount) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount.toString(), asset?.metadata).toString()
        confirmDisabled = convertedSliderAmount === $selectedAccount?.votingPower || $selectedAccount?.isTransferring
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)

            // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
            $popupState.props = { newVotingPower: rawAmount }

            await checkActiveProfileAuth(
                async () => {
                    await setVotingPower(rawAmount)
                },
                { stronghold: true, ledger: false }
            )
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        disabled = true
        try {
            isVoting = await isSelectedAccountVoting()
            await _onMount()
            if ($hasToRevote) {
                modifyPopupState({ ...$popupState, preventClose: true, hideClose: true })
            } else {
                disabled = $selectedAccount?.isTransferring
            }
        } catch (err) {
            disabled = false
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
        />
        {#if isVoting}
            <TextHint warning text={localize('popups.manageVotingPower.revote')} />
        {/if}
        <TextHint info text={localize('popups.manageVotingPower.hint')} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            type={HTMLButtonType.Submit}
            disabled={confirmDisabled}
            isBusy={$selectedAccount?.isTransferring}
            classes="w-full"
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
