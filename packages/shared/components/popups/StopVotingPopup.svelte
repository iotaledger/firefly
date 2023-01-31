<script lang="ts">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { ButtonVariant } from 'shared/components/enums'
    import { closePopup } from '@auxiliary/popup/actions'
    import { showAppNotification } from '@auxiliary/notification/actions'
    import { handleError } from '@core/error/handlers'
    import { stopVotingForProposal } from '@contexts/governance/actions'
    import { selectedProposal } from '@contexts/governance/stores'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
    import {
        addActivitiesToAccountActivitiesInAllAccountActivities,
        generateActivities,
        preprocessTransaction,
    } from '@core/wallet'
    import { activeProfile, ProfileType } from '@core/profile'
    import { handleLedgerError } from '@core/ledger'

    $: isTransferring = $selectedAccount?.isTransferring

    function onCancelClick(): void {
        closePopup()
    }

    async function onStopVotingClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(async () => {
                updateSelectedAccount({ isTransferring: true })

                const transaction = await stopVotingForProposal($selectedProposal?.id)
                const processedTransaction = await preprocessTransaction(transaction, $selectedAccount)
                const activities = generateActivities(processedTransaction, $selectedAccount)
                addActivitiesToAccountActivitiesInAllAccountActivities($selectedAccount.index, activities)

                showAppNotification({
                    type: 'success',
                    message: localize('notifications.stopVoting.success'),
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

<stop-voting>
    <Text type={TextType.h3}>{localize('popups.stopVoting.title')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-6">
        <Text fontSize="15"
            >{localize('popups.stopVoting.body', { values: { proposalName: $selectedProposal?.title } })}</Text
        >
        <TextHint info text={localize('popups.stopVoting.hint')} />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            variant={ButtonVariant.Primary}
            classes="w-full"
            onClick={onStopVotingClick}
            disabled={isTransferring}
            isBusy={isTransferring}>{localize('actions.stopVoting')}</Button
        >
    </div>
</stop-voting>
