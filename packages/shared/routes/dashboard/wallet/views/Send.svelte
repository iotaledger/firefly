<script lang="typescript">
    import { localize } from '@core/i18n'
    import { accountRouter } from '@core/router'
    import { Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Icon, Illustration, Input, ProgressBar, Text } from 'shared/components'
    import {
        clearSendParams,
        keyboardHeight,
        isKeyboardOpened,
        mobile,
        sendParams,
        getKeyboardTransitionSpeed,
    } from 'shared/lib/app'
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
    import { Platform } from 'shared/lib/platform'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { isLedgerProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { CurrencyTypes } from 'shared/lib/typings/currency'
    import { TransferProgressEventData, TransferProgressEventType, TransferState } from 'shared/lib/typings/events'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { NotificationType } from 'shared/lib/typings/notification'
    import { SendParams } from 'shared/lib/typings/sendParams'
    import { LabeledWalletAccount, WalletAccount } from 'shared/lib/typings/wallet'
    import { changeUnits, formatUnitPrecision } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import {
        DUST_THRESHOLD,
        handleTransactionEventData,
        isTransferring,
        selectedAccountStore,
        transferState,
        wallet,
    } from 'shared/lib/wallet'
    import { getContext, onDestroy, onMount } from 'svelte'
    import { get, Readable } from 'svelte/store'

    export let onSend = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}

    const { accounts } = $wallet

    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')
    const addressPrefix = ($selectedAccountStore ?? $liveAccounts[0])?.depositAddress?.split('1')?.[0]

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

    // TODO: find a better solution to avoid a crash when the action sheet is called again
    // before the last call is finished.
    let isActionSheetCalled = false

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
            label: localize('general.transferSyncing'),
            percent: 20,
        },
        SelectingInputs: {
            label: localize('general.transferSelectingInputs'),
            percent: 30,
        },
        GeneratingRemainderDepositAddress: {
            label: localize('general.transferRemainderAddress'),
            percent: 40,
        },
        PreparedTransaction: {
            label: localize('general.transferPreparedTransaction'),
            percent: 50,
        },
        SigningTransaction: {
            label: localize('general.transferSigning'),
            percent: 60,
        },
        PerformingPoW: {
            label: localize('general.transferPow'),
            percent: 70,
        },
        Broadcasting: {
            label: localize('general.transferBroadcasting'),
            percent: 80,
        },
        Complete: {
            label: localize('general.transferComplete'),
            percent: 100,
        },
    }

    let accountsDropdownItems: LabeledWalletAccount[]
    $: {
        accountsDropdownItems = $liveAccounts.map((acc) => addLabel(acc))
        if (to) {
            to = accountsDropdownItems.find((a) => a.id === to.id)
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
                    message: localize('error.send.transaction'),
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
        if (selectedSendType !== type) {
            selectedSendType = type
            to = undefined
            clearErrors()
        }
    }

    const handleToSelect = (item) => {
        to = item
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
        const balanceAsMi = changeUnits($selectedAccountStore.rawIotaBalance, Unit.i, Unit.Mi)
        const isMaxAmount = Math.round(amountAsMi) === Math.round(balanceAsMi)

        const hasDustRemaining = Math.abs($selectedAccountStore.rawIotaBalance - amountAsIota) < DUST_THRESHOLD
        return isMaxAmount && isFiat && hasDustRemaining ? $selectedAccountStore.rawIotaBalance : amountAsIota
    }

    const handleSendClick = (): void => {
        clearErrors()

        if (selectedSendType === SEND_TYPE.EXTERNAL) {
            // Validate address length
            if (address.length !== ADDRESS_LENGTH) {
                addressError = localize('error.send.addressLength', {
                    values: {
                        length: ADDRESS_LENGTH,
                    },
                })
            } else {
                addressError = validateBech32Address(addressPrefix, address)
            }
        } else {
            if (!to) {
                toError = localize('error.send.noToAccount')
            }
        }

        if (amount.length === 0) {
            amountError = localize('error.send.amountInvalidFormat')
        } else if (unit === Unit.i && Number.parseInt(amount, 10).toString() !== amount) {
            amountError = localize('error.send.amountNoFloat')
        } else {
            const amountAsFloat = parseCurrency(amount)

            if (Number.isNaN(amountAsFloat)) {
                amountError = localize('error.send.amountInvalidFormat')
            } else {
                amountRaw = setRawAmount(amountAsFloat)

                if (amountRaw > $selectedAccountStore.rawIotaBalance) {
                    amountError = localize('error.send.amountTooHigh')
                } else if (amountRaw <= 0) {
                    amountError = localize('error.send.amountZero')
                } else if (amountRaw < DUST_THRESHOLD) {
                    amountError = localize('error.send.sendingDust')
                }
            }
        }

        if (!amountError && !addressError && !toError) {
            // If this is an external send but the dest address is in one of
            // the other accounts, detect it to display the right popup
            // but keep the tx external to keep the original entered address
            const internal = selectedSendType === SEND_TYPE.INTERNAL
            let accountAlias = internal ? to?.alias : undefined

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
                    accountId: $selectedAccountStore.id,
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
                ? onInternalTransfer(
                      $selectedAccountStore.id,
                      to.id,
                      amountRaw,
                      selectedSendType === SEND_TYPE.INTERNAL
                  )
                : onSend($selectedAccountStore.id, address, amountRaw)

        if ($isSoftwareProfile) {
            _send(isInternal)
        } else if ($isLedgerProfile) {
            promptUserToConnectLedger(false, () => _send(isInternal), undefined)
        }
    }

    const handleBackClick = (): void => {
        clearSendParams()

        $accountRouter.previous()
    }

    const addLabel = (account: WalletAccount): LabeledWalletAccount => ({
        ...account,
        label: `${account?.alias} • ${account.balance}`,
    })

    const handleMaxClick = (): void => {
        amount = isFiatCurrency(unit)
            ? formatNumber(
                  convertToFiat(
                      $selectedAccountStore.rawIotaBalance,
                      $currencies[CurrencyTypes.USD],
                      $exchangeRates[unit]
                  )
              )
            : formatUnitPrecision($selectedAccountStore.rawIotaBalance, unit, false)
    }

    const updateFromSendParams = (sendParams: SendParams): void => {
        selectedSendType = sendParams.isInternal && $liveAccounts.length > 1 ? SEND_TYPE.INTERNAL : SEND_TYPE.EXTERNAL
        unit = sendParams.unit ?? (Number(sendParams.amount) === 0 ? Unit.Mi : Unit.i)
        amount = sendParams.amount !== undefined ? String(sendParams.amount) : ''
        address = sendParams.address
        to = sendParams?.toWalletAccount?.id !== $selectedAccountStore.id ? sendParams?.toWalletAccount : undefined
        if (accountsDropdownItems) {
            to =
                $liveAccounts.length === 2
                    ? accountsDropdownItems[$selectedAccountStore.id === $liveAccounts[0].id ? 1 : 0]
                    : to
        }
    }

    const sendSubscription = sendParams.subscribe((s): void => {
        updateFromSendParams(s)
    })

    const onQRClick = (): void => {
        const onSuccess = (result: string) => {
            selectedSendType = SEND_TYPE.EXTERNAL
            to = null
            address = result
        }
        const onError = (): void => {
            showAppNotification({
                type: 'error',
                message: localize('error.global.generic'),
            })
        }
        void startQRScanner(onSuccess, onError)
    }

    const selectInternal = async (evt: Event): Promise<void> => {
        const node = evt.target as HTMLElement
        const accountItems = accountsDropdownItems.filter((item) => item.id !== $selectedAccountStore.id)

        if (isActionSheetCalled) {
            return
        }

        isActionSheetCalled = true

        const index = await Platform.showActionSheet({
            title: localize(`general.${SEND_TYPE.INTERNAL}`),
            options: [...accountItems.map((item) => ({ title: item.alias })), { title: 'Cancel', style: 'CANCEL' }],
        })

        isActionSheetCalled = false
        if (index == accountItems.length) {
            node.blur()
            return
        }

        to = accountItems[index]

        selectedSendType = SEND_TYPE.INTERNAL
    }

    const showUnitActionSheet = async (units: Unit[], callback: (toUnit: Unit) => void): Promise<void> => {
        if (isActionSheetCalled) {
            return
        }

        isActionSheetCalled = true

        const index = await Platform.showActionSheet({
            title: localize('general.unit'),
            options: [...units.map((unit) => ({ title: unit as string })), { title: 'Cancel', style: 'CANCEL' }],
        })

        isActionSheetCalled = false
        callback(units[index])
    }

    onMount((): void => {
        updateFromSendParams($sendParams)
    })

    onDestroy((): void => {
        if (transactionTimeoutId) clearTimeout(transactionTimeoutId)
        sendSubscription()
    })

    $: address,
        unit,
        amount,
        selectedSendType,
        to,
        sendParams.update((_sendParams) => ({
            ..._sendParams,
            address,
            unit,
            amount: amount ? String(amount) : '',
            toWalletAccount: to ? addLabel(to) : undefined,
            isInternal: selectedSendType === SEND_TYPE.INTERNAL,
        }))
</script>

{#if $mobile}
    <div class="send-drawer h-full flex flex-col justify-between p-6 overflow-hidden">
        <div>
            <div class="w-full text-center">
                <Text bold bigger>{localize('general.sendFunds')}</Text>
                <div class="absolute right-4 top-4">
                    <button class="p-3" on:click={onQRClick}>
                        <Icon icon="qr" classes="text-blue-500" />
                    </button>
                </div>
            </div>
            <div
                style="margin-top: {$isKeyboardOpened ? '-230px' : '0px'}; opacity: {$isKeyboardOpened
                    ? 0
                    : 1}; transition: opacity {getKeyboardTransitionSpeed($isKeyboardOpened) +
                    'ms'} var(--transition-scroll); transition: margin-top {getKeyboardTransitionSpeed(
                    $isKeyboardOpened
                ) + 'ms'} var(--transition-scroll)"
            >
                <Illustration height={230} background illustration="send-mobile" />
            </div>
            <div class="w-full h-full flex flex-col justify-between {$isKeyboardOpened && 'pt-6'}">
                <div>
                    <div class="w-full block">
                        {#if selectedSendType === SEND_TYPE.INTERNAL}
                            <span
                                class="absolute right-9 mt-3.5 z-10"
                                on:click={() => (selectedSendType = SEND_TYPE.EXTERNAL)}
                            >
                                <Icon
                                    icon="close"
                                    classes="z-10 ml-2 text-gray-500 dark:text-white"
                                    width="22"
                                    height="22"
                                />
                            </span>
                            <div class="mb-4 w-full" on:click={selectInternal}>
                                <Input autofocus type="button" value={to?.label || null} />
                            </div>
                        {:else}
                            {#if accountsDropdownItems.length > 1 && address.length === 0}
                                <button
                                    class="absolute right-10 mt-4 z-10 text-12 text-gray-500 focus:text-blue-500"
                                    on:click={selectInternal}
                                >
                                    {localize('general.moveFundsButton')}
                                </button>
                            {/if}
                            <Address
                                error={addressError}
                                bind:address
                                label={localize('general.sendToAddress')}
                                disabled={$isTransferring}
                                placeholder={`${localize('general.sendToAddress')} \n${addressPrefix}...`}
                                classes="mb-4"
                                autofocus={false}
                            />
                        {/if}
                        <Amount
                            error={amountError}
                            bind:amount
                            bind:unit
                            customUnitPresentation={showUnitActionSheet}
                            onMaxClick={handleMaxClick}
                            disabled={$isTransferring}
                            autofocus={address !== '' ? true : false}
                        />
                    </div>
                </div>
            </div>
        </div>
        {#if !$isTransferring}
            <div
                class="mt-8 flex flex-row justify-between px-2"
                style="margin-bottom: {$isKeyboardOpened
                    ? $keyboardHeight
                    : 0}px; transition: margin-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
                    'ms'} var(--transition-scroll)"
            >
                <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>
                    {localize('actions.cancel')}
                </Button>
                <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{localize('actions.send')}</Button>
            </div>
        {/if}
        {#if $isTransferring}
            <ProgressBar
                classes="my-6"
                preloading={!$transferState}
                secondary
                message={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.label}
                percent={transferSteps[$transferState?.type || TransferProgressEventType.SyncingAccount]?.percent}
            />
        {/if}
    </div>
{:else}
    <div class="w-full h-full flex flex-col justify-between p-6">
        <div>
            <div class="flex flex-row w-full justify-between mb-6">
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
                            {localize(`general.${SEND_TYPE.EXTERNAL}`)}
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
                                {localize(`general.${SEND_TYPE.INTERNAL}`)}
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
                    <div class="w-full block">
                        {#if selectedSendType === SEND_TYPE.INTERNAL}
                            <Dropdown
                                value={to?.label || null}
                                label={localize('general.to')}
                                placeholder={localize('general.to')}
                                items={accountsDropdownItems.filter((a) => a.id !== $selectedAccountStore.id)}
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
                                label={localize('general.sendToAddress')}
                                disabled={$isTransferring}
                                placeholder={`${localize('general.sendToAddress')}\n${addressPrefix}...`}
                                classes="mb-6"
                                autofocus
                            />
                        {/if}
                        <Amount
                            error={amountError}
                            bind:amount
                            bind:unit
                            onMaxClick={handleMaxClick}
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
                    {localize('actions.cancel')}
                </Button>
                <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{localize('actions.send')}</Button>
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
{/if}

<style type="text/scss">
    .send-drawer {
        height: calc(97vh - env(safe-area-inset-top));
    }
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
