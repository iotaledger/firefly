<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    import { getMessageParticipationAction } from 'shared/lib/participation'
    import { ParticipationAction } from 'shared/lib/participation/types'
    import { Payload, Transaction } from 'shared/lib/typings/message'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        findAccountWithAddress,
        findAccountWithAnyAddress,
        getIncomingFlag,
        getInternalFlag,
        getMilestoneMessageValue,
        isParticipationPayload,
        receiverAddressesFromTransactionPayload,
        sendAddressFromTransactionPayload,
        wallet,
    } from 'shared/lib/wallet'

    export let id: string
    export let timestamp: string
    export let confirmed: boolean
    export let payload: Payload
    export let balance // migration tx
    export let onClick = (): void => {}

    const { accounts } = $wallet

    let accountAlias = ''
    let direction: string
    let messageValue = ''
    let date = localize('error.invalidDate')
    let txPayload: Transaction

    $: {
        try {
            date = formatDate(new Date(timestamp), {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })
        } catch {
            date = localize('error.invalidDate')
        }
    }
    $: hasCachedMigrationTx = !payload
    $: milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    $: txPayload = payload?.type === 'Transaction' ? payload : undefined
    $: hasCachedMigrationTx, milestonePayload, txPayload, (messageValue = getMessageValue())
    $: senderAddress = sendAddressFromTransactionPayload(payload)
    $: receiverAddresses = receiverAddressesFromTransactionPayload(payload)
    $: participationAction = getMessageParticipationAction(id, timestamp)

    // There can only be one sender address
    $: senderAccount = findAccountWithAddress(senderAddress)

    // For an incoming transaction there might be multiple receiver addresses
    // especially if there was a remainder, so if any account addresses match
    // we need to find the account details for our address match
    $: receiverAccount =
        getIncomingFlag(txPayload) || getInternalFlag(txPayload)
            ? findAccountWithAnyAddress(receiverAddresses, senderAccount)
            : null
    $: {
        if (txPayload) {
            const acc = txPayload.data.essence.data.incoming ? senderAccount : receiverAccount

            // The address in the payload was one of our accounts so grab
            // the account alias to display
            if (acc) {
                accountAlias = acc.alias
            } else {
                // We can't find the address in our accounts so just display the abbreviated address
                accountAlias = truncateString(
                    txPayload.data.essence.data.incoming ? receiverAddresses[0] : senderAddress,
                    4,
                    3
                )
            }
        }
    }
    $: {
        if (txPayload) {
            if (isParticipationPayload(txPayload)) {
                direction = 'general.stakingTransaction'
            } else if (txPayload.data.essence.data.internal) {
                direction = confirmed
                    ? txPayload.data.essence.data.incoming
                        ? 'general.transferFrom'
                        : 'general.transferTo'
                    : txPayload.data.essence.data.incoming
                    ? 'general.transferringFrom'
                    : 'general.transferringTo'
            } else {
                direction = confirmed
                    ? txPayload.data.essence.data.incoming
                        ? 'general.receivedFrom'
                        : 'general.sentTo'
                    : txPayload.data.essence.data.incoming
                    ? 'general.receivingFrom'
                    : 'general.sendingTo'
            }
        }
    }

    function getMessageValue(): string {
        if (hasCachedMigrationTx) {
            return formatUnitBestMatch(balance, true, 3)
        }
        if (milestonePayload) {
            return formatUnitBestMatch(getMilestoneMessageValue(milestonePayload, $accounts), true, 3)
        }
        return `${
            !txPayload.data.essence.data.incoming && !isParticipationPayload(txPayload) ? '-' : ''
        }${formatUnitBestMatch(txPayload.data.essence.data.value, true, 2)}`
    }

    let icon: string
    let iconColor: string
    $: {
        if (hasCachedMigrationTx || milestonePayload) {
            icon = 'double-chevron-right'
            iconColor = 'gray-600'
        } else if (isParticipationPayload(txPayload)) {
            icon = getParticipationIcon(participationAction)
            iconColor = 'gray-600'
        } else if (txPayload.data.essence.data.internal) {
            icon = 'transfer'
            iconColor = 'gray-600'
        } else if (txPayload.data.essence.data.incoming) {
            icon = 'chevron-down'
            iconColor = 'blue-700'
        } else {
            icon = 'chevron-up'
            iconColor = 'blue-500'
        }
    }

    function getParticipationIcon(action: ParticipationAction): string {
        switch (action) {
            case ParticipationAction.Stake:
            case ParticipationAction.Unstake:
                return 'tokens'
            case ParticipationAction.Vote:
            case ParticipationAction.Unvote:
                return 'voting'
            default:
                return 'participation'
        }
    }
    function getParticipationActionLocaleKey(action: ParticipationAction): string {
        switch (action) {
            case ParticipationAction.Stake:
                return 'stakingTransaction'
            case ParticipationAction.Vote:
                return 'votingTransaction'
            case ParticipationAction.Unstake:
                return 'unstakingTransaction'
            case ParticipationAction.Unvote:
                return 'unvotingTransaction'
            default:
                return 'participationTransaction'
        }
    }
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-opacity-50 p-4 {!confirmed ||
    hasCachedMigrationTx
        ? 'opacity-50'
        : ''} {hasCachedMigrationTx ? 'pointer-events-none' : ''} overflow-hidden"
    disabled={hasCachedMigrationTx}
>
    <div class="w-8 flex flex-row justify-center items-center">
        <Icon width="22" height="22" boxed classes="text-white" boxClasses="bg-{iconColor}" {icon} />
    </div>
    <div class="flex flex-col ml-3.5 space-y-1.5 overflow-hidden">
        <Text type="p" bold smaller classes="overflow-hidden overflow-ellipsis multiwrap-line2">
            {#if hasCachedMigrationTx || milestonePayload}
                {localize('general.fundMigration')}
            {:else if isParticipationPayload(txPayload)}
                {localize(`general.${getParticipationActionLocaleKey(participationAction)}`)}
            {:else}{localize(direction, { values: { account: accountAlias } })}{/if}
        </Text>
        <p class="text-10 leading-120 text-gray-500">{date}</p>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller classes="whitespace-nowrap">{messageValue}</Text>
    </div>
</button>
