<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Icon, ProgressBar, Text } from 'shared/components'
    import { clearSendParams, sendParams } from 'shared/lib/app'
    import { parseCurrency } from 'shared/lib/currency'
    import { ledgerDeviceState, displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { displayNotifications, removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import {
        GeneratingRemainderDepositAddressEvent,
        PreparedTransactionEvent,
        TransferProgressEventData,
        TransferProgressEventType,
        TransferState,
    } from 'shared/lib/typings/events'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import type { NotificationType } from 'shared/lib/typings/notification'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { changeUnits, formatUnitPrecision } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import { isTransferring, transferState, wallet, WalletAccount } from 'shared/lib/wallet'
    import { getContext, onDestroy, onMount } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { get } from 'svelte/store'

    export let locale
    export let send
    export let internalTransfer

    const { accounts } = $wallet

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')

    enum SEND_TYPE {
        EXTERNAL = 'sendPayment',
        INTERNAL = 'moveFunds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = ''
    let address = ''
    let to = undefined
    let amountError = ''
    let addressPrefix = ($account ?? $liveAccounts[0]).depositAddress.split('1')[0]
    let addressError = ''
    let toError = ''
    let amountRaw

    let ledgerAwaitingConfirmation = false

    let transactionEventData: TransferProgressEventData = null
    let transactionTimeoutId = null
    let transactionNotificationId = null

    // This looks odd but sets a reactive dependency on amount, so when it changes the error will clear
    $: amount, (amountError = '')
    $: to, (toError = '')
    $: address, (addressError = '')

    let transferSteps: {
        [key in TransferProgressEventType]: {
            label: string
            percent: number
        }
    } = {
        SyncingAccount: {
            label: locale('general.transferSyncing'),
            percent: 20,
        },
        SelectingInputs: {
            label: locale('general.transferSelectingInputs'),
            percent: 30,
        },
        GeneratingRemainderDepositAddress: {
            label: locale('general.transferRemainderAddress'),
            percent: 40,
        },
        PreparedTransaction: {
            label: locale('general.transferPreparedTransaction'),
            percent: 50,
        },
        SigningTransaction: {
            label: locale('general.transferSigning'),
            percent: 60,
        },
        PerformingPoW: {
            label: locale('general.transferPow'),
            percent: 70,
        },
        Broadcasting: {
            label: locale('general.transferBroadcasting'),
            percent: 80,
        },
        Complete: {
            label: locale('general.transferComplete'),
            percent: 100,
        },
    }

    let accountsDropdownItems
    let from
    $: {
        accountsDropdownItems = $liveAccounts.map((acc) => format(acc))

        if (from) {
            from = accountsDropdownItems.find((a) => a.id === from.id)
        } else {
            from = $account ? accountsDropdownItems.find((a) => a.id === $account.id) : accountsDropdownItems[0]
        }
        if (to) {
            to = accountsDropdownItems.find((a) => a.id === to.id)
        }
    }

    const handleTransactionEventData = (eventData: TransferProgressEventData): any => {
        if (!eventData) return {}

        const remainderData = eventData as GeneratingRemainderDepositAddressEvent
        if (remainderData?.address) return { remainderAddress: remainderData?.address }

        const txData = eventData as PreparedTransactionEvent
        if (!(txData?.inputs && txData?.outputs) || txData?.inputs.length <= 0 || txData?.outputs.length <= 0) return {}

        const numOutputs = txData.outputs.length
        if (numOutputs === 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,
            }
        } else if (numOutputs > 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,

                remainderAddress: txData.outputs[numOutputs - 1].address,
                remainderAmount: txData.outputs[numOutputs - 1].amount,
            }
        } else {
            return txData
        }
    }

    const handleTransferState = (state: TransferState): void => {
        if (!state) return

        const _onCancel = () => {
            isTransferring.set(false)
            transferState.set(null)

            clearSendParams(selectedSendType === SEND_TYPE.INTERNAL)
            closePopup(true)

            if (get(displayNotifications).length === 0)
                showAppNotification({
                    type: 'error',
                    message: locale('error.send.transaction'),
                })
        }

        const { data, type } = state
        switch (type) {
            case TransferProgressEventType.GeneratingRemainderDepositAddress:
                transactionEventData = data

            /**
             * NOTE: The break statement is omitted in this case to allow the next block of code
             * (under SigningTransaction) to be executed.
             */

            case TransferProgressEventType.SigningTransaction:
                ledgerAwaitingConfirmation = true

                openPopup({
                    type: 'ledgerTransaction',
                    hideClose: true,
                    preventClose: true,
                    props: {
                        onCancel: _onCancel,
                        ...handleTransactionEventData(transactionEventData),
                    },
                })

                break

            case TransferProgressEventType.PreparedTransaction:
                /**
                 * CAUTION: The Ledger confirmation doesn't always trigger
                 * the popup to close, so it is programmatically enforced here.
                 */
                if (get(popupState).active) closePopup(true)

                transactionEventData = data

                break

            default:
                if (ledgerAwaitingConfirmation) {
                    ledgerAwaitingConfirmation = false

                    closePopup(true)
                }

                break
        }
    }

    $: if (get(isLedgerProfile)) handleTransferState($transferState)

    $: if (!$isTransferring && ledgerAwaitingConfirmation) {
        closePopup(true)
    }

    const checkLedgerDeviceState = (
        state: LedgerDeviceState,
        notificationType: NotificationType = 'error',
        ignoreNotDetected: boolean = false
    ): void => {
        /**
         * NOTE: The NotDetected state is another state to not show notifications for
         * because the Ledger app assumes this state upon entering / exiting apps for a
         * miniscule amount of time (but still enough to read as "Not Detected"), resulting
         * in lots of unnecessary errors. The logic here is a little hard to reason, but it
         * accomodates for if we want to ignore the NotDetected state.
         */
        switch (state) {
            case LedgerDeviceState.Connected:
                if(transactionNotificationId) {
                    removeDisplayNotification(transactionNotificationId)

                    transactionNotificationId = null
                }

                break

            case LedgerDeviceState.Locked:
                if (transactionTimeoutId) clearTimeout(transactionTimeoutId)

                transactionTimeoutId = setTimeout(
                    () => checkLedgerDeviceState(get(ledgerDeviceState), notificationType, ignoreNotDetected),
                    10000
                )

                break

            default:
                transactionNotificationId = displayNotificationForLedgerProfile(notificationType, false, false, ignoreNotDetected)

                break
        }
    }

    let _ledgerDeviceState
    $: _ledgerDeviceState = $ledgerDeviceState
    $: {
        checkLedgerDeviceState($ledgerDeviceState, 'warning', true)
    }

    const clearErrors = () => {
        amountError = ''
        addressError = ''
        toError = ''
    }

    const handleSendTypeClick = (type) => {
        selectedSendType = type
        clearErrors()
    }
    const handleFromSelect = (item) => {
        from = item
        if (to === from) {
            to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : undefined
        }
        clearErrors()
    }
    const handleToSelect = (item) => {
        to = item
        if (from === to) {
            from = undefined
        }
        clearErrors()
    }
    const handleSendClick = () => {
        clearErrors()

        if (selectedSendType === SEND_TYPE.EXTERNAL) {
            // Validate address length
            if (address.length !== ADDRESS_LENGTH) {
                addressError = locale('error.send.addressLength', {
                    values: {
                        length: ADDRESS_LENGTH,
                    },
                })
            } else {
                addressError = validateBech32Address(addressPrefix, address)
            }
        } else {
            if (!to) {
                toError = locale('error.send.noToAccount')
            }
        }

        if (amount.length === 0) {
            amountError = locale('error.send.amountInvalidFormat')
        } else if (unit === Unit.i && Number.parseInt(amount, 10).toString() !== amount) {
            amountError = locale('error.send.amountNoFloat')
        } else {
            let amountAsFloat = parseCurrency(amount)
            if (Number.isNaN(amountAsFloat)) {
                amountError = locale('error.send.amountInvalidFormat')
            } else {
                amountRaw = changeUnits(amountAsFloat, unit, Unit.i)
                if (amountRaw > from.balance) {
                    amountError = locale('error.send.amountTooHigh')
                } else if (amountRaw <= 0) {
                    amountError = locale('error.send.amountZero')
                } else if (amountRaw < 1000000) {
                    amountError = locale('error.send.sendingDust')
                }
            }
        }

        if (!amountError && !addressError && !toError) {
            // If this is an external send but the dest address is in one of
            // the other accounts switch it to an internal transfer
            let internal = selectedSendType === SEND_TYPE.INTERNAL

            if (!internal) {
                for (const acc of $accounts) {
                    const internalAddress = acc.addresses.find((a) => a.address === address)
                    if (internalAddress) {
                        internal = true
                        to = acc
                        break
                    }
                }
            }

            handleLedgerConnection(() =>
                openPopup({
                    type: 'transaction',
                    props: {
                        internal,
                        amount: amountRaw,
                        unit,
                        to: internal ? to.alias : address,
                        onConfirm: () => triggerSend(internal),
                    },
                })
            )
        }
    }

    const triggerSend = (isInternal) => {
        closePopup()

        const _send = (isInternal: boolean): any => {
            /**
             * NOTE: selectedSendType is passed (only to the internalTransfer method) in the
             * case that we are masquerading as an internal transfer by sending to an address
             * in another account. Send parameters are reset once the transfer completes.
             */
            return () =>
                isInternal
                    ? internalTransfer(from.id, to.id, amountRaw, selectedSendType === SEND_TYPE.INTERNAL)
                    : send(from.id, address, amountRaw)
        }

        handleLedgerConnection(_send(isInternal))
    }

    const handleLedgerConnection = (onSuccess: any) => {
        /**
         * NOTE: Because the Ledger must be connected to send a transaction,
         * it is important to wrap the send function in the Ledger connection
         * prompt function (only for non-software profiles).
         */
        if ($isSoftwareProfile) onSuccess()
        else {
            promptUserToConnectLedger(false, onSuccess, undefined)
        }
    }

    const handleBackClick = () => {
        clearSendParams()

        accountRoute.set(AccountRoutes.Init)
        if (!$account) {
            walletRoute.set(WalletRoutes.Init)
        }
    }

    const format = (account: WalletAccount) => {
        return {
            ...account,
            label: `${account.alias} • ${account.balance}`,
            balance: account.rawIotaBalance,
        }
    }
    const handleMaxClick = () => {
        amount = formatUnitPrecision(from.balance, unit, false)
    }

    const updateFromSendParams = (s) => {
        selectedSendType = s.isInternal && $liveAccounts.length > 1 ? SEND_TYPE.INTERNAL : SEND_TYPE.EXTERNAL
        unit = s.amount === 0 ? Unit.Mi : Unit.i
        amount = s.amount === 0 ? '' : formatUnitPrecision(s.amount, Unit.i, false)
        address = s.address
        if (from && accountsDropdownItems) {
            to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : to
        }
    }

    const sendSubscription = sendParams.subscribe((s) => {
        updateFromSendParams(s)
    })

    onMount(() => {
        updateFromSendParams($sendParams)
    })

    onDestroy(() => {
        if (transactionTimeoutId) clearTimeout(transactionTimeoutId)
        sendSubscription()
    })
</script>

<style type="text/scss">
    button.active {
        @apply relative;
        &:after {
            content: '';
            @apply bg-blue-500;
            @apply w-full;
            @apply rounded;
            @apply h-0.5;
            @apply absolute;
            @apply -bottom-2.5;
            @apply left-0;
        }
    }
</style>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row w-full justify-between mb-8">
            <div class="flex flex-row space-x-6">
                <button
                    on:click={() => handleSendTypeClick(SEND_TYPE.EXTERNAL)}
                    disabled={$isTransferring}
                    class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}
                    class:active={SEND_TYPE.EXTERNAL === selectedSendType && !$isTransferring}>
                    <Text classes="text-left" type="h5" secondary={SEND_TYPE.EXTERNAL !== selectedSendType || $isTransferring}>
                        {locale(`general.${SEND_TYPE.EXTERNAL}`)}
                    </Text>
                </button>
                {#if $liveAccounts.length > 1}
                    <button
                        on:click={() => handleSendTypeClick(SEND_TYPE.INTERNAL)}
                        disabled={$isTransferring}
                        class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}
                        class:active={SEND_TYPE.INTERNAL === selectedSendType && !$isTransferring}>
                        <Text
                            classes="text-left"
                            type="h5"
                            secondary={SEND_TYPE.INTERNAL !== selectedSendType || $isTransferring}>
                            {locale(`general.${SEND_TYPE.INTERNAL}`)}
                        </Text>
                    </button>
                {/if}
            </div>
            <button on:click={handleBackClick}>
                <Icon icon="close" classes="text-gray-800 dark:text-white" />
            </button>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                {#if !$account}
                    <div class="block mb-6">
                        <Dropdown
                            value={from?.label || null}
                            label={locale('general.from')}
                            placeholder={locale('general.from')}
                            items={accountsDropdownItems}
                            onSelect={handleFromSelect}
                            disabled={$liveAccounts.length === 1 || $isTransferring} />
                    </div>
                {/if}
                <div class="w-full block">
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={to?.label || null}
                            label={locale('general.to')}
                            placeholder={locale('general.to')}
                            items={accountsDropdownItems.filter((a) => from && a.id !== from.id)}
                            onSelect={handleToSelect}
                            disabled={$isTransferring || $liveAccounts.length === 2}
                            error={toError}
                            classes="mb-6"
                            autofocus={$liveAccounts.length > 2} />
                    {:else}
                        <Address
                            error={addressError}
                            bind:address
                            {locale}
                            label={locale('general.sendToAddress')}
                            disabled={$isTransferring}
                            placeholder={`${locale('general.sendToAddress')}\n${addressPrefix}...`}
                            classes="mb-6"
                            autofocus />
                    {/if}
                    <Amount
                        error={amountError}
                        bind:amount
                        bind:unit
                        maxClick={handleMaxClick}
                        {locale}
                        disabled={$isTransferring}
                        autofocus={selectedSendType === SEND_TYPE.INTERNAL && $liveAccounts.length === 2} />
                </div>
            </div>
        </div>
    </div>
    {#if !$isTransferring}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>{locale('actions.cancel')}</Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
        </div>
    {/if}
    {#if $isTransferring}
        <ProgressBar
            preloading={!$transferState}
            secondary
            message={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.label}
            percent={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.percent} />
    {/if}
</div>
