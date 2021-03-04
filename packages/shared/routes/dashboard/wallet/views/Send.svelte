<script lang="typescript">
    import { convertUnits, Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, ProgressBar, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import type { TransferProgressEventType } from 'shared/lib/typings/events'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { ADDRESS_LENGTH, VALID_DEVNET_ADDRESS, VALID_MAINNET_ADDRESS } from 'shared/lib/utils'
    import { isTransferring, transferError, transferState, WalletAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale
    export let send
    export let internalTransfer

    const accounts = getContext<Writable<WalletAccount[]>>('walletAccounts')
    const account = getContext<Readable<WalletAccount>>('selectedAccount')

    enum SEND_TYPE {
        EXTERNAL = 'send_payment',
        INTERNAL = 'move_funds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = convertUnits($sendParams.amount, Unit.i, unit)
    let to = undefined
    let amountError = ''
    let addressError = ''

    let transferSteps: {
        [key in TransferProgressEventType]: {
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
    }

    $: accountsDropdownItems = $accounts.map((acc) => format(acc))
    $: from = $account ? format($account) : accountsDropdownItems[0]
    $: $sendParams.amount = convertUnits(amount, unit, Unit.i)

    const handleSendTypeClick = (type) => {
        selectedSendType = type
        amountError = undefined
    }
    const handleFromSelect = (item) => {
        from = item
        amountError = undefined
    }
    const handleToSelect = (item) => {
        to = item
        amountError = undefined
    }
    const handleSendClick = () => {
        if ($sendParams.amount > from.balance) {
            return (amountError = locale('error.send.amountTooHigh'))
        } else if ($sendParams.amount <= 0) {
            return (amountError = locale('error.send.amountZero'))
        }
        if (selectedSendType === SEND_TYPE.EXTERNAL) {
            // Validate address length
            if ($sendParams.address.length !== ADDRESS_LENGTH) {
                return (addressError = locale('error.send.addressLength', {
                    values: {
                        length: ADDRESS_LENGTH,
                    },
                }))
            }
            if ($activeProfile.isDeveloperProfile) {
                if (!$sendParams.address.match(VALID_DEVNET_ADDRESS)) {
                    return (addressError = locale('error.send.wrongAddressFormatDev'))
                }
            } else {
                if (!$sendParams.address.match(VALID_MAINNET_ADDRESS)) {
                    return (addressError = locale('error.send.wrongAddressFormat'))
                }
            }
        }

        if (selectedSendType === SEND_TYPE.INTERNAL) {
            internalTransfer(from.id, to.id, $sendParams.amount)
        } else {
            send(from.id, $sendParams.address, $sendParams.amount)
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
        amount = convertUnits(from.balance, Unit.i, unit)
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6 space-x-4">
            {#each Object.values(SEND_TYPE) as type}
                <button
                    on:click={() => handleSendTypeClick(type)}
                    disabled={$isTransferring}
                    class={$isTransferring ? 'cursor-auto' : 'cursor-pointer'}>
                    <Text type="h5" disabled={type !== selectedSendType || $isTransferring}>{locale(`general.${type}`)}</Text>
                </button>
            {/each}
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
                            disabled={$isTransferring} />
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
                        disabled={$isTransferring} />
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={to?.label || ''}
                            label={locale('general.to')}
                            items={accountsDropdownItems}
                            onSelect={handleToSelect}
                            disabled={$isTransferring} />
                    {:else}
                        <Address
                            error={addressError}
                            bind:address={$sendParams.address}
                            {locale}
                            label={locale('general.to')}
                            disabled={$isTransferring} />
                    {/if}
                    {#if $transferError}
                        <Text type="p" error>
                            {$transferError === 'insufficient funds' ? locale('error.send.insufficientFunds') : $transferError}
                        </Text>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    {#if !$isTransferring}
        <!-- Action -->
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
        </div>
    {/if}
    {#if $isTransferring}
        <ProgressBar message={transferSteps[$transferState]?.label} percent={transferSteps[$transferState]?.percent} />
    {/if}
</div>
