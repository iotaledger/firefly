<script lang="ts">
    import { Button, Text, TextHint, AssetAmountInput } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { convertToRawAmount, visibleSelectedAccountAssets } from '@core/wallet'
    import { closePopup, openPopup, PopupId, popupState } from '@auxiliary/popup'
    import { onMount } from 'svelte'
    import { isAccountVoting } from '@contexts/governance/utils'
    import { activeProfile } from '@core/profile'
    import { TextHintVariant } from '@ui/TextHint.svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let newVotingPower: string = undefined

    let assetAmountInput: AssetAmountInput
    let amount: string
    let rawAmount = newVotingPower ?? $selectedAccount?.votingPower
    let confirmDisabled = false

    $: asset = $visibleSelectedAccountAssets[$activeProfile?.network.id].baseCoin
    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: hasTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress ||
        $selectedAccount?.hasVotingTransactionInProgress ||
        $selectedAccount?.isTransferring
    $: amount, hasTransactionInProgress, setConfirmDisabled()

    function setConfirmDisabled(): void {
        if (!amount) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount, asset?.metadata)?.toString()
        confirmDisabled = convertedSliderAmount === $selectedAccount?.votingPower || hasTransactionInProgress
    }

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)

            if (amount === '0' && isAccountVoting($selectedAccount.index)) {
                openPopup({ id: PopupId.VotingPowerToZero })
                return
            }

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
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<form id="manage-voting-power" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
    <Text type={TextType.p} classes="mb-5">{localize('popups.manageVotingPower.body')}</Text>
    <div class="space-y-4 mb-6">
        <AssetAmountInput
            bind:this={assetAmountInput}
            bind:rawAmount
            bind:amount
            {asset}
            containsSlider
            disableAssetSelection
            disabled={hasTransactionInProgress}
            {votingPower}
        />
        <TextHint variant={TextHintVariant.Info} text={localize('popups.manageVotingPower.hint')} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline disabled={hasTransactionInProgress} classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            type={HTMLButtonType.Submit}
            disabled={confirmDisabled}
            isBusy={hasTransactionInProgress}
            classes="w-full"
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
