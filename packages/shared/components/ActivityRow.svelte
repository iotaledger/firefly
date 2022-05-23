<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { truncateString } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { Payload } from 'shared/lib/typings/message'
    import { ParticipationAction } from 'shared/lib/participation/types'
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
    } from 'shared/lib/wallet'
    import { activeAccounts } from '@core/profile'
    import { FontWeightText } from './Text.svelte'

    export let confirmed
    export let payload: Payload
    export let balance // migration tx
    export let onClick = (): void => {}

    let messageValue = ''
    let fiatValue = ''

    $: hasCachedMigrationTx = !payload
    $: milestonePayload = payload?.type === 'Milestone' ? payload : undefined
    $: txPayload = payload?.type === 'Transaction' ? payload : undefined
    $: hasCachedMigrationTx, milestonePayload, txPayload, (messageValue = getMessageValue())
    $: fiatValue = getFiat(messageValue)

    const getMessageValue = () => {
        if (hasCachedMigrationTx) {
            return formatUnitBestMatch(balance, true, 3)
        }
        if (milestonePayload) {
            return formatUnitBestMatch(getMilestoneMessageValue(milestonePayload, $activeAccounts), true, 3)
        }

        return `${
            !txPayload.data.essence.data.incoming && !isParticipationPayload(txPayload) ? '-' : ''
        }${formatUnitBestMatch(txPayload.data.essence.data.value, true, 2)}`
    }

    $: senderAddress = sendAddressFromTransactionPayload(payload)
    $: receiverAddresses = receiverAddressesFromTransactionPayload(payload)

    // There can only be one sender address
    $: senderAccount = findAccountWithAddress(senderAddress)

    // For an incoming transaction there might be multiple receiver addresses
    // especially if there was a remainder, so if any account addresses match
    // we need to find the account details for our address match
    $: receiverAccount =
        getIncomingFlag(txPayload) || getInternalFlag(txPayload)
            ? findAccountWithAnyAddress(receiverAddresses, senderAccount)
            : null

    let accountAlias = ''

    $: {
        if (txPayload) {
            const acc = txPayload.data.essence.data.incoming ? senderAccount : receiverAccount

            // The address in the payload was one of our accounts so grab
            // the account alias to display
            if (acc) {
                accountAlias = acc.getAlias()
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

    let activity: string
    $: {
        if (txPayload) {
            const data = txPayload.data.essence.data
            if (isParticipationPayload(txPayload)) {
                activity = 'general.stakingTransaction'
            } else if (data.internal) {
                activity = confirmed ? 'general.transfer' : 'general.transferring'
            } else {
                activity = confirmed
                    ? data.incoming
                        ? 'general.received'
                        : 'general.sent'
                    : data.incoming
                    ? 'general.receiving'
                    : 'general.sending'
            }
        }
    }

    let direction: string
    $: {
        if (txPayload) {
            direction = txPayload.data.essence.data.incoming ? 'general.fromAddress' : 'general.toAddress'
        }
    }

    let icon: string
    let iconColor: string
    $: {
        if (hasCachedMigrationTx || milestonePayload) {
            icon = 'double-chevron-right'
            iconColor = 'gray-600'
        } else if (isParticipationPayload(txPayload)) {
            icon = getParticipationIcon(ParticipationAction.Stake)
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
                return ''
        }
    }

    function getFiat(messageValue: string) {
        // TODO: Calculate real fiat value
        return '---'
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
                {localize('general.stakingTransaction')}
            {:else}
                {localize(activity)}
            {/if}
        </Text>
        {#if txPayload}
            <p class="text-10 leading-120 text-gray-500">
                {localize(direction, { values: { account: accountAlias } })}
            </p>
        {/if}
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text
            type="p"
            font-weight={FontWeightText.bold}
            color={txPayload?.data?.essence?.data?.incoming ? 'blue-700' : ''}
            smaller
            classes="whitespace-nowrap font-bold">{messageValue}</Text
        >
        <Text type="p" smaller classes="whitespace-nowrap">{fiatValue}</Text>
    </div>
</button>
