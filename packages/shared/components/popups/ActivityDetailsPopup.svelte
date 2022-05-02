<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getOfficialExplorer } from 'shared/lib/network'
    import { Platform } from 'shared/lib/platform'
    import { getMilestoneMessageValue, isParticipationPayload, wallet } from 'shared/lib/wallet'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { TransactionDetails } from 'shared/components/molecules'
    import { getTransactionSubjectAddressOrAccount } from '@lib/utils/transactionObject'
    import { ActivityStatus, ActivityType, ActivityAsyncStatus } from '@lib/typings/activity'

    export let message: { id: any; timestamp?: any; confirmed?: any; payload?: any; balance?: any }
    $: ({ id, payload, balance, timestamp, confirmed } = message)

    const { accounts } = $wallet
    const explorerLink = getOfficialExplorer($accounts[0].clientOptions.network)

    let type: ActivityType
    $: {
        if (payload?.type) {
            if (isParticipationPayload(payload)) {
                type = ActivityType.Stake
            } else if (payload.data.essence.data.internal) {
                type = ActivityType.Transfer
            } else {
                type = payload.data.essence.data.incoming ? ActivityType.Receive : ActivityType.Send
            }
        } else {
            type = ActivityType.Migrate
        }
    }

    const asyncStatus = undefined

    $: status = confirmed ? ActivityStatus.Confirmed : ActivityStatus.Pending
    $: cachedMigrationTx = !payload
    $: milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    $: transactionPayload = payload?.type === 'Transaction' ? payload : undefined

    let value = 0
    $: {
        if (cachedMigrationTx) {
            value = balance
        } else if (milestonePayload) {
            value = getMilestoneMessageValue(milestonePayload, $accounts)
        } else if (transactionPayload) {
            value = transactionPayload.data.essence.data.value
        }
    }

    let transactionSubjectAddressOrAccount: { isSubjectAccount: boolean; subject: string }
    $: transactionSubjectAddressOrAccount = getTransactionSubjectAddressOrAccount(transactionPayload)

    $: transactionDetails = {
        ...transactionDetails,
        type,
        status,
        asyncStatus,
        value,
        ...(transactionSubjectAddressOrAccount.isSubjectAccount && {
            account: transactionSubjectAddressOrAccount.subject,
        }),
        ...(!transactionSubjectAddressOrAccount.isSubjectAccount && {
            address: transactionSubjectAddressOrAccount.subject,
        }),
        timestamp,
    }
</script>

<activity-details-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeightText.semibold} classes="text-left"
        >{localize('popups.transactionDetails.title')}</Text
    >
    <TransactionDetails {...transactionDetails} />
    <Button
        classes="w-full"
        secondary
        autofocus={false}
        onClick={() => Platform.openUrl(`${explorerLink}/message/${id}`)}
    >
        <Text bigger color="blue-500">{localize('general.viewOnExplorer')}</Text>
    </Button>
</activity-details-popup>
