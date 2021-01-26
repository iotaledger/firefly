<script lang="typescript">
    import { createEventDispatcher, getContext } from 'svelte'
    import { Text, Button, Dropdown, Amount, Address } from 'shared/components'

    export let locale
    export let internal = false
    export let send
    export let internalTransfer

    const dispatch = createEventDispatcher()
    const accounts = getContext('walletAccounts')

    $: accountsDropdownItems = $accounts.map((acc) => ({ value: acc.index, label: `${acc.name} • ${acc.balance}` }))
    $: from = $accounts.map((acc) => ({ value: acc.index, label: `${acc.name} • ${acc.balance}` }))[0]
    let toAccount = $accounts.map((acc) => ({ value: acc.index, label: `${acc.name} • ${acc.balance}` }))[0]
    let toAddress = ''
    let amount = undefined

    const handleFromSelect = (item) => {
        from = item
    }
    const handleToSelect = (item) => {
        toAccount = item
    }
    const handleSendClick = () => {
        if (internal) {
            internalTransfer(from.value, toAccount.value, amount)
        } else {
            send(from.value, toAddress, amount)
        }
    }
    const handleBackClick = () => {
        dispatch('previous')
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.send_funds')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                <div class="block mb-8">
                    <Dropdown
                        value={from?.label || ''}
                        label={locale('general.from')}
                        items={accountsDropdownItems}
                        onSelect={handleFromSelect} />
                </div>
                <div class="w-full mb-8 block">
                    <Amount bind:amount {locale} classes="mb-4" />
                    {#if internal}
                        <Dropdown
                            value={toAccount?.label || ''}
                            label={locale('general.to')}
                            items={accountsDropdownItems}
                            onSelect={handleToSelect} />
                    {:else}
                        <Address bind:address={toAddress} {locale} label={locale('general.to')} />
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
