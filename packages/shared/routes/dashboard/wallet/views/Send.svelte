<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Icon, ProgressBar, Text } from 'shared/components'
    import { clearSendParams, sendParams } from 'shared/lib/app'
    import { parseCurrency } from 'shared/lib/currency'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import type { TransferProgressEventType } from 'shared/lib/typings/events'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { changeUnits, formatUnitPrecision } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import { isTransferring, transferState, wallet, WalletAccount } from 'shared/lib/wallet'
    import { getContext, onDestroy, onMount } from 'svelte'
    import type { Readable } from 'svelte/store'

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

    // This looks odd but sets a reactive dependency on amount, so when it changes the error will clear
    $: amount, (amountError = '')
    $: to, (toError = '')
    $: address, (addressError = '')

    let transferSteps: {
        [key in TransferProgressEventType | 'Complete']: {
            label: string
            percent: number
        }
    } = {
        SyncingAccount: {
            label: locale('general.transferSyncing'),
            percent: 30,
        },
        SelectingInputs: {
            label: locale('general.transferSelectingInputs'),
            percent: 40,
        },
        GeneratingRemainderDepositAddress: {
            label: locale('general.transferRemainderAddress'),
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
        }
    }

    const triggerSend = (internal) => {
        closePopup()
        if (internal) {
            // We pass the original selectedSendType in case we are masquerading as
            // an internal transfer by a send to an address in one of our
            // other accounts. When the transfer completes it resets
            // the send params to where it was
            internalTransfer(from.id, to.id, amountRaw, selectedSendType === SEND_TYPE.INTERNAL)
        } else {
            send(from.id, address, amountRaw)
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
            message={transferSteps[$transferState]?.label}
            percent={transferSteps[$transferState]?.percent} />
    {/if}
</div>
