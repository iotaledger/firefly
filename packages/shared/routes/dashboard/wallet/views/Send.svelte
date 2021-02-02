<script lang="typescript">
    import { createEventDispatcher, getContext } from 'svelte'
    import { Text, Button, Dropdown, Amount, Address } from 'shared/components'
    import { sendParams } from 'shared/lib/app'

    export let locale
    export let send
    export let internalTransfer

    const dispatch = createEventDispatcher()
    const accounts = getContext('walletAccounts')

    enum SEND_TYPE {
        EXTERNAL = 'send_payment',
        INTERNAL = 'move_funds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL

    $: accountsDropdownItems = $accounts.map((acc) => ({ value: acc.id, label: `${acc.name} • ${acc.balance}` }))
    $: from = $accounts.map((acc) => ({ value: acc.id, label: `${acc.name} • ${acc.balance}` }))[0]
    let account = $accounts.map((acc) => ({ value: acc.id, label: `${acc.name} • ${acc.balance}` }))[0]


    const handleSendTypeClick = (type) => {
        selectedSendType = type
    }
    const handleFromSelect = (item) => {
        from = item
    }
    const handleToSelect = (item) => {
        account = item
    }
    const handleSendClick = () => {
        if (selectedSendType === SEND_TYPE.INTERNAL) {
            internalTransfer(from.value, account.value, $sendParams.amount)
        } else {
            send(from.value, $sendParams.address, $sendParams.amount)
        }
    }
    const handleBackClick = () => {
        dispatch('previous')
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
                <div class="block mb-8">
                    <Dropdown
                        value={from?.label || ''}
                        label={locale('general.from')}
                        items={accountsDropdownItems}
                        onSelect={handleFromSelect} />
                </div>
                <div class="w-full mb-8 block">
                    <Amount bind:amount={$sendParams.amount} {locale} classes="mb-4" />
                    {#if selectedSendType === SEND_TYPE.INTERNAL}
                        <Dropdown
                            value={account?.label || ''}
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
