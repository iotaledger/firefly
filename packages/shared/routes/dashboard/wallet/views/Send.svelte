<script lang="typescript">
    import { convertUnits, Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Error, Icon, ProgressBar, Text } from 'shared/components'
    import { clearSendParams, sendParams } from 'shared/lib/app'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import type { TransferProgressEventType } from 'shared/lib/typings/events'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { convertUnitsNoE } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import { isTransferring, transferState, WalletAccount } from 'shared/lib/wallet'
    import { getContext, onDestroy, onMount } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let locale
    export let send
    export let internalTransfer

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')

    enum SEND_TYPE {
        EXTERNAL = 'sendPayment',
        INTERNAL = 'moveFunds',
    }

    let selectedSendType = $sendParams.isInternal ? SEND_TYPE.INTERNAL : SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = $sendParams.amount === 0 ? '' : convertUnitsNoE($sendParams.amount, Unit.i, unit)
    let to = undefined
    let amountError = ''
    let addressPrefix = ($account ?? $liveAccounts[0]).depositAddress.split('1')[0]
    let addressError = ''
    let toError = ''

    // This looks odd but sets a reactive dependency on amount, so when it changes the error will clear
    $: amount, (amountError = '')
    $: to, (toError = '')
    $: $sendParams.address, (addressError = '')

    const sendSubscription = sendParams.subscribe((s) => {
        selectedSendType = s.isInternal ? SEND_TYPE.INTERNAL : SEND_TYPE.EXTERNAL
        amount = s.amount === 0 ? '' : convertUnitsNoE(s.amount, Unit.i, unit)
    })

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

    $: accountsDropdownItems = $liveAccounts.map((acc) => format(acc))
    $: from = $account ? format($account) : accountsDropdownItems[0]

    const handleSendTypeClick = (type) => {
        $sendParams.isInternal = type === SEND_TYPE.INTERNAL
        amountError = ''
    }
    const handleFromSelect = (item) => {
        from = item
        if (to === from) {
            to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : undefined
        }
        amountError = ''
    }
    const handleToSelect = (item) => {
        to = item
        if (from === to) {
            from = undefined
        }
        amountError = ''
    }
    const handleSendClick = () => {
        amountError = ''
        addressError = ''

        if (unit === Unit.i && Number.parseInt(amount, 10).toString() !== amount) {
            amountError = locale('error.send.amountNoFloat')
        } else {
            let amountAsFloat = Number.parseFloat(amount)
            if (Number.isNaN(amountAsFloat)) {
                amountError = locale('error.send.amountInvalidFormat')
            } else {
                const amountAsI = convertUnits(amountAsFloat, unit, Unit.i)
                if (amountAsI > from.balance) {
                    amountError = locale('error.send.amountTooHigh')
                } else if (amountAsI <= 0) {
                    amountError = locale('error.send.amountZero')
                } else if (amountAsI < 1000000) {
                    amountError = locale('error.send.sendingDust')
                }

                if (selectedSendType === SEND_TYPE.EXTERNAL) {
                    // Validate address length
                    if ($sendParams.address.length !== ADDRESS_LENGTH) {
                        addressError = locale('error.send.addressLength', {
                            values: {
                                length: ADDRESS_LENGTH,
                            },
                        })
                    } else {
                        addressError = validateBech32Address(addressPrefix, $sendParams.address)
                    }
                } else {
                    if (!to) {
                        toError = locale('error.send.noToAccount')
                    }
                }

                if (!amountError && !addressError && !toError) {
                    $sendParams.amount = amountAsI
                    openPopup({
                        type: 'transaction',
                        props: {
                            internal: selectedSendType === SEND_TYPE.INTERNAL,
                            amount: $sendParams.amount,
                            to: selectedSendType === SEND_TYPE.INTERNAL ? to.alias : $sendParams.address,
                            onConfirm: triggerSend,
                        },
                    })
                }
            }
        }
    }

    const triggerSend = () => {
        closePopup()
        if (selectedSendType === SEND_TYPE.INTERNAL) {
            internalTransfer(from.id, to.id, $sendParams.amount)
        } else {
            send(from.id, $sendParams.address, $sendParams.amount)
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
        amount = convertUnitsNoE(from.balance, Unit.i, unit)
    }
    onMount(() => {
        to = $liveAccounts.length === 2 ? accountsDropdownItems[from.id === $liveAccounts[0].id ? 1 : 0] : to
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
                    <Amount
                        error={amountError}
                        bind:amount
                        bind:unit
                        maxClick={handleMaxClick}
                        {locale}
                        classes="mb-6"
                        disabled={$isTransferring}
                        autofocus />
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={to?.label || null}
                            label={locale('general.to')}
                            placeholder={locale('general.to')}
                            items={accountsDropdownItems.filter((a) => from && a.id !== from.id)}
                            onSelect={handleToSelect}
                            disabled={$isTransferring || $liveAccounts.length === 2} />
                        <Error error={toError} />
                    {:else}
                        <Address
                            error={addressError}
                            bind:address={$sendParams.address}
                            {locale}
                            label={locale('general.sendToAddress')}
                            disabled={$isTransferring}
                            placeholder={`${locale('general.sendToAddress')}\n${addressPrefix}...`} />
                    {/if}
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
        <ProgressBar message={transferSteps[$transferState]?.label} percent={transferSteps[$transferState]?.percent} />
    {/if}
</div>
