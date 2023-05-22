<script lang="ts">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { ButtonVariant } from 'shared/components/enums'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { stopVotingForProposal } from '@contexts/governance/actions'
    import { selectedProposal } from '@contexts/governance/stores'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    function onCancelClick(): void {
        closePopup()
    }

    async function onStopVotingClick(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await stopVotingForProposal($selectedProposal?.id)
            closePopup()
        })
    }
</script>

<stop-voting>
    <Text type={TextType.h3}>{localize('popups.stopVoting.title')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-6">
        <Text fontSize="15"
            >{localize('popups.stopVoting.body', { values: { proposalName: $selectedProposal?.title } })}</Text
        >
        <TextHint info text={localize('popups.stopVoting.hint')} />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" disabled={hasGovernanceTransactionInProgress} onClick={onCancelClick}
            >{localize('actions.cancel')}</Button
        >
        <Button
            variant={ButtonVariant.Primary}
            classes="w-full"
            onClick={onStopVotingClick}
            disabled={hasGovernanceTransactionInProgress}
            isBusy={hasGovernanceTransactionInProgress}
        >
            {localize('actions.stopVoting')}</Button
        >
    </div>
</stop-voting>
