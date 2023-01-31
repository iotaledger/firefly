<script lang="typescript">
    import { Button, Text, TextHint } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { setVotingPower } from '@contexts/governance/actions'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { popupState } from '@auxiliary/popup/stores'

    export let isVoting: boolean = false

    const rawAmount = '0'

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            // After unlocking stronghold popup, the popup tracks newVotingPower to show it when reopened.
            $popupState.props = { newVotingPower: rawAmount }

            await checkActiveProfileAuth(async () => {
                openPopup({
                    type: 'manageVotingPower',
                    props: { newVotingPower: rawAmount },
                })
                await setVotingPower(rawAmount, isVoting)
            })
        } catch (err) {
            handleError(err)
        }
    }
</script>

<form class="space-y-4" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.manageVotingPower.title')}</Text>
    <TextHint warning text={localize('popups.manageVotingPower.amountZero')} />
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button
            type={HTMLButtonType.Submit}
            isBusy={$selectedAccount?.isTransferring}
            disabled={$selectedAccount?.isTransferring}
            classes="w-full"
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
