<script lang="ts">
    import { Button, Text, FontWeight, TextHint, TextType, KeyValueBox } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { vote } from '@contexts/governance/actions'
    import { ABSTAIN_VOTE_VALUE } from '@contexts/governance/constants'
    import { selectedProposal } from '@contexts/governance/stores'

    export let selectedAnswerValues: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch(Number($selectedAccount?.votingPower), getBaseToken())
    $: hasVotingPower = Number($selectedAccount?.votingPower) > 0

    $: hasGovernanceTransactionInProgress =
        $selectedAccount?.hasVotingPowerTransactionInProgress || $selectedAccount?.hasVotingTransactionInProgress

    $: numberOfAbstainedQuestions =
        selectedAnswerValues?.filter((answerValue) => answerValue === ABSTAIN_VOTE_VALUE).length ?? 0

    async function onSubmit(): Promise<void> {
        if (hasVotingPower) {
            await checkActiveProfileAuth(async () => {
                await vote($selectedProposal?.id, selectedAnswerValues)
                closePopup()
            })
        } else {
            openPopup({ id: PopupId.ManageVotingPower })
        }
    }
</script>

<form
    id="vote-proposal"
    on:submit|preventDefault={onSubmit}
    class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0"
>
    <Text type={TextType.h4} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.voteForProposal.title')}
    </Text>
    <Text fontSize="14" classes="text-left break-words">
        {localize('popups.voteForProposal.body', {
            values: {
                proposal: $selectedProposal?.title,
            },
        })}
    </Text>
    <div class="space-y-4">
        <KeyValueBox keyText={localize('popups.voteForProposal.key')} valueText={formattedVotingPower} />
        {#if !hasVotingPower}
            <TextHint danger text={localize('popups.voteForProposal.noVotingPower')} />
        {:else if numberOfAbstainedQuestions > 0}
            <TextHint
                warning
                text={localize('popups.voteForProposal.hasAbstained', {
                    values: { numberOfQuestions: numberOfAbstainedQuestions },
                })}
            />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" disabled={hasGovernanceTransactionInProgress} outline onClick={closePopup}
            >{localize('actions.cancel')}</Button
        >
        <Button
            type={HTMLButtonType.Submit}
            classes="w-full"
            disabled={hasGovernanceTransactionInProgress}
            isBusy={hasGovernanceTransactionInProgress}
        >
            {hasVotingPower ? localize('actions.vote') : localize('views.governance.votingPower.manage')}
        </Button>
    </popup-buttons>
</form>
