<script lang="typescript">
    import { convertUnits, Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, ProgressBar, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import type { TransferProgressEventType } from 'shared/lib/typings/events'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { convertUnitsNoE } from 'shared/lib/units'
    import { ADDRESS_LENGTH, validateBech32Address } from 'shared/lib/utils'
    import { isTransferring, transferState, WalletAccount } from 'shared/lib/wallet'
    import { getContext, onMount } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale
    export let send
    export let internalTransfer

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const account = getContext<Readable<WalletAccount>>('selectedAccount')

    enum SEND_TYPE {
        EXTERNAL = 'sendPayment',
        INTERNAL = 'moveFunds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = $sendParams.amount === 0 ? '' : convertUnitsNoE($sendParams.amount, Unit.i, unit)
    let to = undefined
    let amountError = ''
    let addressPrefix = ($account ?? $accounts[0]).depositAddress.split('1')[0]
    let addressError = ''

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

    $: accountsDropdownItems = $accounts.map((acc) => format(acc))
    $: from = $account ? format($account) : accountsDropdownItems[0]

    const handleSendTypeClick = (type) => {
        selectedSendType = type
        amountError = ''
    }
    const handleFromSelect = (item) => {
        from = item
        if (to === from) {
            to = $accounts.length === 2 ? accountsDropdownItems[from.id === $accounts[0].id ? 1 : 0] : undefined
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
                }

                if (selectedSendType === SEND_TYPE.EXTERNAL) {
                    // Validate address length
                    if ($sendParams.address.length !== ADDRESS_LENGTH) {
                        addressError = locale('error.send.addressLength', {
                            values: {
                                length: ADDRESS_LENGTH,
                            },
                        })
                    } else if (!validateBech32Address(addressPrefix, $sendParams.address)) {
                        addressError = locale('error.send.wrongAddressFormat', {
                            values: {
                                prefix: addressPrefix,
                            },
                        })
                    }
                }

                if (!amountError && !addressError) {
                    $sendParams.amount = amountAsI

                    if (selectedSendType === SEND_TYPE.INTERNAL) {
                        internalTransfer(from.id, to.id, $sendParams.amount)
                    } else {
                        send(from.id, $sendParams.address, $sendParams.amount)
                    }
                }
            }
        }
    }

    const handleBackClick = () => {
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
        to = $accounts.length === 2 ? accountsDropdownItems[from.id === $accounts[0].id ? 1 : 0] : to
    })
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6 space-x-4">
            <button
                on:click={() => handleSendTypeClick(SEND_TYPE.EXTERNAL)}
                disabled={$isTransferring}
                class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}>
                <Text type="h5" disabled={SEND_TYPE.EXTERNAL !== selectedSendType || $isTransferring}>
                    {locale(`general.${SEND_TYPE.EXTERNAL}`)}
                </Text>
            </button>
            {#if $accounts.length > 1}
                <button
                    on:click={() => handleSendTypeClick(SEND_TYPE.INTERNAL)}
                    disabled={$isTransferring}
                    class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}>
                    <Text type="h5" disabled={SEND_TYPE.INTERNAL !== selectedSendType || $isTransferring}>
                        {locale(`general.${SEND_TYPE.INTERNAL}`)}
                    </Text>
                </button>
            {/if}
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                {#if !$account}
                    <div class="block mb-5">
                        <Dropdown
                            value={from?.label || ''}
                            label={locale('general.from')}
                            items={accountsDropdownItems}
                            onSelect={handleFromSelect}
                            disabled={$accounts.length === 1 || $isTransferring} />
                    </div>
                {/if}
                <div class="w-full block">
                    <Amount
                        error={amountError}
                        bind:amount
                        bind:unit
                        maxClick={handleMaxClick}
                        {locale}
                        classes="mb-2"
                        disabled={$isTransferring}
                        autofocus />
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={to?.label || ''}
                            label={locale('general.to')}
                            items={accountsDropdownItems.filter((a) => from && a.id !== from.id)}
                            onSelect={handleToSelect}
                            disabled={$isTransferring || $accounts.length === 2} />
                    {:else}
                        <Address
                            error={addressError}
                            bind:address={$sendParams.address}
                            {locale}
                            label={locale('general.to')}
                            disabled={$isTransferring}
                            prefix={`${addressPrefix}...`} />
                    {/if}
                </div>
            </div>
        </div>
    </div>
    {#if !$isTransferring}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
        </div>
    {/if}
    {#if $isTransferring}
        <ProgressBar message={transferSteps[$transferState]?.label} percent={transferSteps[$transferState]?.percent} />
    {/if}
</div>
