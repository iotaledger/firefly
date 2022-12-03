<script lang="typescript">
    import { TextType } from 'shared/components/enums'
    import { Button, Text, TextHint, AssetAmountSliderInput } from 'shared/components'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { setVotingPower } from '@core/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { closePopup } from '@auxiliary/popup'

    const asset = $visibleSelectedAccountAssets?.baseCoin

    let assetAmountSliderInput: AssetAmountSliderInput
    let rawAmount = $selectedAccount?.votingPower

    function handleBack(): void {
        closePopup()
    }

    async function handleConfirm(): Promise<void> {
        try {
            await assetAmountSliderInput?.validate()
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

<Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
<Text type={TextType.p} secondary classes="mb-5">{localize('popups.manageVotingPower.body')}</Text>
<div class="space-y-4 mb-6">
    <AssetAmountSliderInput bind:this={assetAmountSliderInput} bind:rawAmount {asset} />
    <TextHint info text={localize('popups.manageVotingPower.hint')} />
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button outline classes="w-full" disabled={$selectedAccount.isTransferring} onClick={handleBack}>
        {localize('actions.back')}
    </Button>
    <Button
        classes="w-full"
        disabled={$selectedAccount.isTransferring}
        onClick={handleConfirm}
        isBusy={$selectedAccount.isTransferring}
    >
        {localize('actions.confirm')}
    </Button>
</div>
