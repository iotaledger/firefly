<script lang="typescript">
    import { Button, Text, TextHint } from 'shared/components'
    import { HTMLButtonType, TextType } from 'shared/components/enums'
    import { selectedAccount, selectedAccountIndex, vote } from '@core/account'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { checkActiveProfileAuth } from '@core/profile/actions'

    $: isTransferring = $selectedAccount?.isTransferring

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await vote($selectedAccountIndex)
            closePopup()
        })
    }
</script>

<form id="manage-voting-power" class="space-y-5" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.revote.title')}</Text>
    <Text type={TextType.p} secondary>{localize('popups.revote.body')}</Text>
    <TextHint success text={localize('popups.revote.hint')} />
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button type={HTMLButtonType.Submit} disabled={isTransferring} isBusy={isTransferring} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
