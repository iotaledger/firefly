<script lang="typescript">
    import { Button, Text, TextHint, AssetAmountInput } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup'

    const asset = $visibleSelectedAccountAssets?.baseCoin

    let assetAmountInput: AssetAmountInput
    let rawAmount = $selectedAccount?.votingPower

    $: votingPower = parseInt($selectedAccount?.votingPower, 10)
    $: isTransferring = $selectedAccount?.isTransferring

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate()
            await checkActiveProfileAuth(async () => {
                await setVotingPower(rawAmount)
                closePopup()
            })
        } catch (err) {
            handleError(err)
            closePopup()
        }
    }
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
            disabled={isTransferring}
            {votingPower}
        />
        <TextHint info text={localize('popups.manageVotingPower.hint')} />
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button type={HTMLButtonType.Submit} disabled={isTransferring} isBusy={isTransferring} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
