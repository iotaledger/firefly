<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { truncateString, isBright } from 'shared/lib/helpers'
    import { formatDate, localize } from '@core/i18n'
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
        selectedAccount,
        sendAddressFromTransactionPayload,
        wallet,
    } from 'shared/lib/wallet'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { Transaction } from 'shared/lib/typings/message'
    import { getMessageParticipationAction } from 'shared/lib/participation'

    export let id: string
    export let timestamp: string
    export let confirmed: boolean
    export let color: string
    export let includeFullSender: boolean
    export let payload: Payload
    export let balance // migration tx
    export let onClick = (): void => {}

    const { accounts } = $wallet

    let accountAlias = ''
    let direction: string
    let initialsColor: string
    let messageValue = ''
    let date = localize('error.invalidDate')
    let txPayload: Transaction
    let participationLocaleKey: string

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
    $: participationAction = getMessageParticipationAction(id)
    $: {
        switch (participationAction) {
            case ParticipationAction.Stake:
                participationLocaleKey = 'staked'
                break
            case ParticipationAction.Vote:
                participationLocaleKey = 'voted'
                break
            default:
                participationLocaleKey = 'participated'
                break
        }
    }

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
            const acc = txPayload.data.essence.data.incoming ? receiverAccount : senderAccount

            // The address in the payload was one of our accounts so grab
            // the account alias to display
            if (acc) {
                if (includeFullSender) {
                    accountAlias = acc.alias
                }
                initialsColor = getColor($activeProfile, acc.id) as string
            } else {
                // We can't find the address in our accounts so just display the abbreviated address
                if (includeFullSender) {
                    accountAlias = truncateString(
                        txPayload.data.essence.data.incoming ? receiverAddresses[0] : senderAddress,
                        3,
                        3
                    )
                }
            }
        }
    }
    $: {
        if (txPayload) {
            if (includeFullSender) {
                if (isParticipationPayload(txPayload)) {
                    direction = 'staking.stakedFunds'
                } else {
                    direction = confirmed
                        ? txPayload.data.essence.data.incoming
                            ? 'general.receivedTo'
                            : 'general.sentFrom'
                        : txPayload.data.essence.data.incoming
                        ? 'general.receivingTo'
                        : 'general.sendingFrom'
                }
            } else {
                direction = confirmed
                    ? txPayload.data.essence.data.incoming
                        ? 'general.received'
                        : 'general.sent'
                    : txPayload.data.essence.data.incoming
                    ? 'general.receiving'
                    : 'general.sending'
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
    function getParticipationColor(action: ParticipationAction): string {
        switch (action) {
            case ParticipationAction.Stake:
            case ParticipationAction.Vote:
                return 'orange-500'
            case ParticipationAction.Unstake:
            case ParticipationAction.Unvote:
            default:
                return 'blue-500'
        }
    }
    function getParticipationIcon(action: ParticipationAction): string {
        switch (action) {
            case ParticipationAction.Stake:
            case ParticipationAction.Unstake:
                return 'staking'
            case ParticipationAction.Vote:
            case ParticipationAction.Unvote:
                return 'voting'
            default:
                return ''
        }
    }
</script>

<button
    on:click={onClick}
    data-label="transaction-row"
    class="w-full text-left flex rounded-2xl items-center bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 p-4 {!confirmed ||
    hasCachedMigrationTx
        ? 'opacity-50'
        : ''} {hasCachedMigrationTx ? 'pointer-events-none' : ''} overflow-hidden"
    disabled={hasCachedMigrationTx}
>
    <div class="w-8 flex flex-row justify-center items-center">
        {#if hasCachedMigrationTx || milestonePayload}
            <Icon
                width="24"
                height="24"
                boxed
                classes="text-white"
                boxClasses="bg-gray-500 dark:bg-gray-900"
                icon="double-chevron-right"
            />
        {:else if isParticipationPayload(txPayload) && participationAction}
            <Icon
                boxed
                width="24"
                height="24"
                classes="text-white"
                boxClasses="bg-{getParticipationColor(participationAction)}"
                icon={getParticipationIcon(participationAction)}
            />
        {:else}
            <Icon
                boxed
                classes={`text-${isBright(initialsColor) ? 'gray-800' : 'white'}`}
                boxClasses="bg-{initialsColor
                    ? `${initialsColor}-500`
                    : txPayload.data.essence.data.internal
                    ? 'gray-500'
                    : `${color}-${txPayload.data.essence.data.internal ? '500' : '600'}`} dark:bg-gray-900"
                icon={txPayload.data.essence.data.internal
                    ? 'transfer'
                    : txPayload.data.essence.data.incoming
                    ? 'chevron-down'
                    : 'chevron-up'}
                fill={isBright(initialsColor) ? '#000000' : ''}
                boxStyles={`background-color: ${initialsColor || (txPayload.data.essence.data.internal && 'gray')};`}
            />
        {/if}
    </div>
    <div class="flex flex-col ml-3.5 space-y-1.5 overflow-hidden">
        <Text type="p" bold smaller classes="overflow-hidden overflow-ellipsis multiwrap-line2">
            {#if hasCachedMigrationTx || milestonePayload}
                {localize('general.fundMigration')}
            {:else if isParticipationPayload(txPayload)}
                {#if includeFullSender}
                    {localize(`general.${participationLocaleKey}For`, { values: { account: accountAlias } })}
                {:else}{localize(`general.${participationLocaleKey}`)}{/if}
            {:else}{localize(direction, { values: { account: accountAlias } })}{/if}
        </Text>
        <p class="text-10 leading-120 text-gray-500">
            {date}
        </p>
    </div>
    <div class="flex-1 items-end flex flex-col ml-4">
        <Text type="p" smaller classes="whitespace-nowrap">{messageValue}</Text>
    </div>
</button>
