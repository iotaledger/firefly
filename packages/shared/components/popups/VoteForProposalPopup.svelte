<script lang="typescript">
    import { Button, Text, TextHint, FontWeight, TextType, KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { activeProfile } from '@core/profile'
    import { selectedAccount, vote } from '@core/account'
    import type { Event } from '@iota/wallet'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { BASE_TOKEN } from '@core/network'

    export let event: Event
    export let selectedAnswers: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch(
        Number($selectedAccount?.votingPower),
        BASE_TOKEN[$activeProfile.networkProtocol]
    )

    async function confirmClick(): Promise<void> {
        try {
            await vote($selectedAccount.index, event?.id, selectedAnswers)
            closePopup()
        } catch (err) {
            console.error(err)
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h4} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.voteForProposal.title')}
    </Text>
    <Text type={TextType.p} secondary>
        {localize('popups.voteForProposal.body', {
            values: {
                proposal: event?.data?.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <KeyValueBox keyText={localize('popups.voteForProposal.key')} valueText={formattedVotingPower} />
        <TextHint info text={localize('popups.voteForProposal.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={confirmClick}>{localize('actions.vote')}</Button>
    </popup-buttons>
</div>
