<script lang="typescript">
    import { Button, Text, FontWeight, TextType, KeyValueBox } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'
    import { selectedAccount, updateSelectedAccount, vote } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, checkActiveProfileAuth, ProfileType } from '@core/profile'
    import { formatTokenAmountBestMatch, generateActivities, preprocessTransaction } from '@core/wallet/utils'
    import { selectedProposal } from '@contexts/governance/stores'
    import { showAppNotification } from '@auxiliary/notification'
    import { closePopup } from '@auxiliary/popup'
    import { addActivitiesToAccountActivitiesInAllAccountActivities } from '@core/wallet'
    import { handleError } from '@core/error/handlers'
    import { handleLedgerError } from '@core/ledger'

    export let selectedAnswerValues: number[]

    $: formattedVotingPower = formatTokenAmountBestMatch(
        Number($selectedAccount?.votingPower),
        BASE_TOKEN[$activeProfile.networkProtocol]
    )
    $: hasVotingPower = Number($selectedAccount?.votingPower) > 0

    $: isTransferring = $selectedAccount?.isTransferring

    async function handleSubmit(): Promise<void> {
        try {
            await checkActiveProfileAuth(async () => {
                updateSelectedAccount({ isTransferring: true })

                const transaction = await vote($selectedAccount.index, $selectedProposal?.id, selectedAnswerValues)
                const processedTransaction = await preprocessTransaction(transaction, $selectedAccount)
                const activities = generateActivities(processedTransaction, $selectedAccount)
                addActivitiesToAccountActivitiesInAllAccountActivities($selectedAccount.index, activities)

                showAppNotification({
                    type: 'success',
                    message: localize('notifications.vote.success'),
                    alert: true,
                })
                updateSelectedAccount({ isTransferring: false })
                closePopup()
            })
        } catch (err) {
            if ($activeProfile.type === ProfileType.Ledger) {
                handleLedgerError(err)
            } else {
                handleError(err)
            }
            updateSelectedAccount({ isTransferring: false })
        }
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
