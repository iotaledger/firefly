<script lang="ts">
    import { Button, Text, TextHint } from '@ui'
    import { HTMLButtonType, TextHintVariant, TextType } from '@ui/enums'
    import { selectedWallet } from '@core/wallet/stores'
    import { handleError } from '@core/error/handlers'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { closePopup, openPopup, PopupId, popupState } from '@auxiliary/popup'

    const ZERO_VOTING_POWER = '0'

    $: isTransferring =
        $selectedWallet?.hasVotingPowerTransactionInProgress || $selectedWallet?.hasVotingTransactionInProgress

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
            $popupState.props = { newVotingPower: ZERO_VOTING_POWER }

            await checkActiveProfileAuth(async () => {
                openPopup({
                    id: PopupId.ManageVotingPower,
                    props: { newVotingPower: ZERO_VOTING_POWER },
                })
                await setVotingPower(ZERO_VOTING_POWER, true)
            })
        } catch (err) {
            handleError(err)
        }
    }
</script>

<form class="space-y-4" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
    <TextHint variant={TextHintVariant.Warning} text={localize('popups.manageVotingPower.amountZero')} />
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button type={HTMLButtonType.Submit} isBusy={isTransferring} disabled={isTransferring} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
