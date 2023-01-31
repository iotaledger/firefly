<script lang="ts">
    import { Button, Text, FontWeight, TextHint, TextType, KeyValueBox } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network/constants'
    import { activeProfile } from '@core/profile/stores'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { selectedProposal } from '@contexts/governance/stores'
    import { closePopup } from '@auxiliary/popup/actions'
    import { vote } from '@contexts/governance/actions'

    export let selectedAnswerValues: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch(
        Number($selectedAccount?.votingPower),
        BASE_TOKEN[$activeProfile.networkProtocol]
    )
    $: hasVotingPower = Number($selectedAccount?.votingPower) > 0

    $: isTransferring = $selectedAccount?.isTransferring

    async function handleSubmit(): Promise<void> {
        await checkActiveProfileAuth(async () => {
            await vote($selectedProposal?.id, selectedAnswerValues)
            closePopup()
        })
    }
</script>

<form
    id="vote-proposal"
    on:submit|preventDefault={handleSubmit}
    class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0"
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
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button
            type={HTMLButtonType.Submit}
            classes="w-full"
            disabled={!hasVotingPower || isTransferring}
            isBusy={isTransferring}
        >
            {localize('actions.vote')}
        </Button>
    </popup-buttons>
</form>
