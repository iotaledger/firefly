<script lang="ts">
    import { Button, Text, TextHint, HTMLButtonType, TextType } from 'shared/components'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { closeOverlay } from '@auxiliary/popup/actions'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { vote } from '@contexts/governance/actions'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    async function onSubmit(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await vote()
            closeOverlay(true)
        })
    }
</script>

<form id="manage-voting-power" class="space-y-5" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h4} classes="mb-3">{localize('popups.revote.title')}</Text>
    <Text type={TextType.p}>{localize('popups.revote.body')}</Text>
    <TextHint info text={localize('popups.revote.hint')} />
    <Button
        type={HTMLButtonType.Submit}
        disabled={hasGovernanceTransactionInProgress}
        isBusy={hasGovernanceTransactionInProgress}
        classes="w-full"
    >
        {localize('actions.revote')}
    </Button>
</form>
