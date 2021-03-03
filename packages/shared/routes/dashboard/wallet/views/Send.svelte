<script lang="typescript">
    import { convertUnits, Unit } from '@iota/unit-converter'
    import { Address, Amount, Button, Dropdown, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { ADDRESS_LENGTH, VALID_DEVNET_ADDRESS, VALID_MAINNET_ADDRESS } from 'shared/lib/utils'
    import type { Account } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale
    export let send
    export let internalTransfer

    const accounts = getContext<Writable<Account[]>>('walletAccounts')
    const account = getContext<Readable<Account>>('selectedAccount')

    enum SEND_TYPE {
        EXTERNAL = 'send_payment',
        INTERNAL = 'move_funds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL
    let unit = Unit.Mi
    let amount = convertUnits($sendParams.amount, Unit.i, unit)
    let to = undefined

    $: accountsDropdownItems = $accounts.map((acc) => format(acc))
    $: from = $account ? format($account) : accountsDropdownItems[0]
    $: $sendParams.amount = convertUnits(amount, unit, Unit.i)

    const handleSendTypeClick = (type) => {
        selectedSendType = type
    }
    const handleFromSelect = (item) => {
        from = item
    }
    const handleToSelect = (item) => {
        to = item
    }
    const handleSendClick = () => {
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
    const format = (account: Account) => {
        return {
            ...account,
            label: `${account.alias} • ${account.balance}`,
            balance: account.rawIotaBalance,
        }
    }
    const handleMaxClick = () => {
        amount = convertUnits(from.balance, Unit.i, unit)
    }
    const validInputs = () => {
        if ($sendParams.amount > from.balance) {
            console.error('Input error: Amount higher than available balance')
            return false
        }
        if (selectedSendType === SEND_TYPE.EXTERNAL) {
            // Validate address length
            if ($sendParams.address.length !== ADDRESS_LENGTH) {
                console.error('Input error: Wrong address length')
                return false
            }
            if ($activeProfile.isDeveloperProfile) {
                if (!$sendParams.address.match(VALID_MAINNET_ADDRESS) && !$sendParams.address.match(VALID_DEVNET_ADDRESS)) {
                    console.error('Input error: Wrong address format')
                    return false
                } else {
                    if (!$sendParams.address.match(VALID_MAINNET_ADDRESS)) {
                        console.error('Input error: Wrong address format')
                        return false
                    }
                }
            }
        }
        return true
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6 space-x-4">
            {#each Object.values(SEND_TYPE) as type}
                <button on:click={() => handleSendTypeClick(type)}>
                    <Text type="h5" disabled={type !== selectedSendType}>{locale(`general.${type}`)}</Text>
                </button>
            {/each}
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                {#if !$account}
                    <div class="block mb-8">
                        <Dropdown
                            value={from?.label || ''}
                            label={locale('general.from')}
                            items={accountsDropdownItems}
                            onSelect={handleFromSelect} />
                    </div>
                {/if}
                <div class="w-full mb-8 block">
                    <Amount bind:amount bind:unit maxClick={handleMaxClick} {locale} classes="mb-4" />
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={to?.label || ''}
                            label={locale('general.to')}
                            items={accountsDropdownItems}
                            onSelect={handleToSelect} />
                    {:else}
                        <Address bind:address={$sendParams.address} {locale} label={locale('general.to')} />
                    {/if}
                </div>
                <div class="w-full mb-8 block">
                    <Text type="h5" classes="mb-4">{locale('general.reference')}</Text>
                </div>
            </div>
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between px-2">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
    </div>
</div>
