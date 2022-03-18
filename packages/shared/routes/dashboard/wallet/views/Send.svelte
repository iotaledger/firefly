<script lang="typescript">
    import { getContext, onDestroy, onMount } from 'svelte'
    import { get, Readable } from 'svelte/store'
    import { Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Icon, ProgressBar, Text } from 'shared/components'
    import { clearSendParams, sendParams } from 'shared/lib/app'
    import {
        convertFromFiat,
        convertToFiat,
        currencies,
        exchangeRates,
        formatNumber,
        isFiatCurrency,
        parseCurrency,
    } from 'shared/lib/currency'
    import { startQRScanner } from 'shared/lib/device'
    import {
        displayNotificationForLedgerProfile,
        ledgerDeviceState,
        promptUserToConnectLedger,
    } from 'shared/lib/ledger'
    import { displayNotifications, removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import {
        GeneratingRemainderDepositAddressEvent,
        PreparedTransactionEvent,
        TransactionEventData,
        TransferProgressEventData,
        TransferProgressEventType,
        TransferState,
    } from 'shared/lib/typings/events'
    import { Locale } from 'shared/lib/typings/i18n'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { changeUnits, formatUnitPrecision } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import { DUST_THRESHOLD, isTransferring, transferState, wallet } from 'shared/lib/wallet'
    import { mobile } from 'shared/lib/app'
    import { NotificationType } from 'shared/lib/typings/notification'
    import { SendParams } from 'shared/lib/typings/sendParams'
    import { LabeledWalletAccount, WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale
    export let onSend = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}

    const { accounts } = $wallet

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')
    const addressPrefix = ($account ?? $liveAccounts[0])?.depositAddress?.split('1')?.[0]

    enum SEND_TYPE {
        EXTERNAL = 'sendPayment',
        INTERNAL = 'moveFunds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = ''
    let address = ''
    let amountError = ''
    let addressError = ''
    let toError = ''
    let to: LabeledWalletAccount
    let amountRaw: number

    let ledgerAwaitingConfirmation = false

    let transactionEventData: TransferProgressEventData = null
    let transactionTimeoutId = null
    let transactionNotificationId = null

    $: amount, (amountError = '')
    $: to, (toError = '')
    $: address, (addressError = '')

    const transferSteps: {
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

    let accountsDropdownItems: LabeledWalletAccount[]
    let from: LabeledWalletAccount
    $: {
        accountsDropdownItems = $liveAccounts.map((acc) => addLabel(acc))
        if (from) {
            from = accountsDropdownItems.find((a) => a.id === from.id)
        } else {
            from = $account ? accountsDropdownItems.find((a) => a.id === $account.id) : accountsDropdownItems[0]
        }
        if (to) {
            to = accountsDropdownItems.find((a) => a.id === to.id)
        }
    }

    const handleTransactionEventData = (eventData: TransferProgressEventData): TransactionEventData => {
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

            /* eslint-disable no-fallthrough */
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
                if (transactionNotificationId) {
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
                transactionNotificationId = displayNotificationForLedgerProfile(
                    notificationType,
                    false,
                    false,
                    ignoreNotDetected
                )

                break
        }
    }

    $: {
        checkLedgerDeviceState($ledgerDeviceState, 'warning', true)
    }

    const clearErrors = (): void => {
        amountError = ''
        addressError = ''
        toError = ''
    }

    const handleSendTypeClick = (type: SEND_TYPE): void => {
        selectedSendType = type
        clearErrors()
    }

    const handleFromSelect = (item: LabeledWalletAccount): void => {
        from = item
        if (to === from) {
            to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : undefined
        }
        clearErrors()
    }

    const handleToSelect = (item: LabeledWalletAccount): void => {
        to = item
        if (from === to) {
            from = undefined
        }
        clearErrors()
    }

    const setRawAmount = (amountAsFloat: number): number => {
        const isFiat = isFiatCurrency(unit)
        const amountAsIota = isFiat
            ? convertFromFiat(amountAsFloat, $currencies[CurrencyTypes.USD], $exchangeRates[unit])
            : changeUnits(amountAsFloat, unit, Unit.i)
        /**
         * NOTE: Sometimes max values from fiat calculations
         * aren't precise enough, therefore we round the
         * amounts to 1 MI to compare them.
         */
        const amountAsMi = changeUnits(amountAsIota, Unit.i, Unit.Mi)
        const balanceAsMi = changeUnits(from.rawIotaBalance, Unit.i, Unit.Mi)
        const isMaxAmount = Math.round(amountAsMi) === Math.round(balanceAsMi)

        const hasDustRemaining = Math.abs(from.rawIotaBalance - amountAsIota) < DUST_THRESHOLD
        return isMaxAmount && isFiat && hasDustRemaining ? from.rawIotaBalance : amountAsIota
    }

    const handleSendClick = (): void => {
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
            const amountAsFloat = parseCurrency(amount)

            if (Number.isNaN(amountAsFloat)) {
                amountError = locale('error.send.amountInvalidFormat')
            } else {
                amountRaw = setRawAmount(amountAsFloat)

                if (amountRaw > from.rawIotaBalance) {
                    amountError = locale('error.send.amountTooHigh')
                } else if (amountRaw <= 0) {
                    amountError = locale('error.send.amountZero')
                } else if (amountRaw < DUST_THRESHOLD) {
                    amountError = locale('error.send.sendingDust')
                }
            }
        }

        if (!amountError && !addressError && !toError) {
            // If this is an external send but the dest address is in one of
            // the other accounts, detect it to display the right popup
            // but keep the tx external to keep the original entered address
            const internal = selectedSendType === SEND_TYPE.INTERNAL
            let accountAlias = internal ? to.alias : undefined

            if (!internal) {
                for (const acc of $accounts) {
                    const internalAddress = acc.addresses.find((a) => a.address === address)
                    if (internalAddress) {
                        accountAlias = acc.alias
                        break
                    }
                }
            }

            openPopup({
                type: 'transaction',
                props: {
                    accountId: from.id,
                    internal: internal || accountAlias,
                    amount: amountRaw,
                    unit,
                    to: accountAlias ?? address,
                    onConfirm: () => triggerSend(internal),
                },
            })
        }
    }

    const triggerSend = (isInternal: boolean): void => {
        closePopup()

        const _send = (isInternal: boolean): void =>
            /**
             * NOTE: selectedSendType is passed (only to the internalTransfer method) in the
             * case that we are masquerading as an internal transfer by sending to an address
             * in another account. Send parameters are reset once the transfer completes.
             */
            isInternal
                ? onInternalTransfer(from.id, to.id, amountRaw, selectedSendType === SEND_TYPE.INTERNAL)
                : onSend(from.id, address, amountRaw)

        if ($isSoftwareProfile) {
            _send(isInternal)
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => _send(isInternal), undefined)
        }
    }

    const handleBackClick = (): void => {
        clearSendParams()

        accountRoute.set(AccountRoutes.Init)
        if (!$account) {
            walletRoute.set(WalletRoutes.Init)
        }
    }

    const addLabel = (account: WalletAccount): LabeledWalletAccount => ({
        ...account,
        label: `${account.alias} • ${account.balance}`,
    })

    const handleMaxClick = (): void => {
        amount = isFiatCurrency(unit)
            ? formatNumber(convertToFiat(from.rawIotaBalance, $currencies[CurrencyTypes.USD], $exchangeRates[unit]))
            : formatUnitPrecision(from.rawIotaBalance, unit, false)
    }

    const updateFromSendParams = (sendParams: SendParams): void => {
        selectedSendType = sendParams.isInternal && $liveAccounts.length > 1 ? SEND_TYPE.INTERNAL : SEND_TYPE.EXTERNAL
        unit = sendParams.unit ?? (sendParams.amount === 0 ? Unit.Mi : Unit.i)
        const rawAmount = changeUnits(sendParams.amount, unit, Unit.i)
        amount = sendParams.amount === 0 ? '' : formatUnitPrecision(rawAmount, unit, false)
        address = sendParams.address
        if (from && accountsDropdownItems) {
            to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : to
        }
    }

    const sendSubscription = sendParams.subscribe((s): void => {
        updateFromSendParams(s)
    })

    const onQRClick = (): void => {
        const onSuccess = (result: string) => {
            address = result
        }
        const onError = (): void => {
            showAppNotification({
                type: 'error',
                message: locale('error.global.generic'),
            })
        }
        void startQRScanner(onSuccess, onError)
    }

    onMount((): void => {
        updateFromSendParams($sendParams)
    })

    onDestroy((): void => {
        if (transactionTimeoutId) clearTimeout(transactionTimeoutId)
        sendSubscription()
    })
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row w-full justify-between mb-8">
            <div class="flex flex-row space-x-6">
                <button
                    on:click={() => handleSendTypeClick(SEND_TYPE.EXTERNAL)}
                    disabled={$isTransferring}
                    class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}
                    class:active={SEND_TYPE.EXTERNAL === selectedSendType && !$isTransferring}
                >
                    <Text
                        classes="text-left"
                        type="h5"
                        secondary={SEND_TYPE.EXTERNAL !== selectedSendType || $isTransferring}
                    >
                        {locale(`general.${SEND_TYPE.EXTERNAL}`)}
                    </Text>
                </button>
                {#if $liveAccounts.length > 1}
                    <button
                        on:click={() => handleSendTypeClick(SEND_TYPE.INTERNAL)}
                        disabled={$isTransferring}
                        class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}
                        class:active={SEND_TYPE.INTERNAL === selectedSendType && !$isTransferring}
                    >
                        <Text
                            classes="text-left"
                            type="h5"
                            secondary={SEND_TYPE.INTERNAL !== selectedSendType || $isTransferring}
                        >
                            {locale(`general.${SEND_TYPE.INTERNAL}`)}
                        </Text>
                    </button>
                {/if}
            </div>
            <div class="flex flex-row space-x-4">
                {#if $mobile}
                    <button on:click={onQRClick}>
                        <Icon icon="qr" classes="text-blue-500" />
                    </button>
                {/if}
                <button on:click={handleBackClick}>
                    <Icon icon="close" classes="text-gray-800 dark:text-white" />
                </button>
            </div>
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
                            disabled={$liveAccounts.length === 1 || $isTransferring}
                        />
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
                            autofocus={$liveAccounts.length > 2}
                        />
                    {:else}
                        <Address
                            error={addressError}
                            bind:address
                            {locale}
                            label={locale('general.sendToAddress')}
                            disabled={$isTransferring}
                            placeholder={`${locale('general.sendToAddress')}\n${addressPrefix}...`}
                            classes="mb-6"
                            autofocus
                        />
                    {/if}
                    <Amount
                        error={amountError}
                        bind:amount
                        bind:unit
                        onMaxClick={handleMaxClick}
                        {locale}
                        disabled={$isTransferring}
                        autofocus={selectedSendType === SEND_TYPE.INTERNAL && $liveAccounts.length === 2}
                    />
                </div>
            </div>
        </div>
    </div>
    {#if !$isTransferring}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>
                {locale('actions.cancel')}
            </Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
        </div>
    {/if}
    {#if $isTransferring}
        <ProgressBar
            preloading={!$transferState}
            secondary
            message={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.label}
            percent={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.percent}
        />
    {/if}
</div>

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
