<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, Button, Dropdown, Amount, Address } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { walletViewState, WalletViewStates, accountViewState, AccountViewStates } from 'shared/lib/router'

    export let locale
    export let send
    export let internalTransfer

    const accounts = getContext('walletAccounts')
    const account = getContext('selectedAccount')

    enum SEND_TYPE {
        EXTERNAL = 'send_payment',
        INTERNAL = 'move_funds',
    }

    let selectedSendType = SEND_TYPE.EXTERNAL

    $: accountsDropdownItems = $accounts.map((acc) => format(acc))
    $: from = $account ? format($account) : accountsDropdownItems[0]
    let to = undefined

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
        accountViewState.set(AccountViewStates.Init)
        if (!$account) {
            walletViewState.set(WalletViewStates.Init)
        }
    }
    const format = (account) => {
        return { value: account.id, label: `${account.name} • ${account.balance}` }
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
                    <Amount bind:amount={$sendParams.amount} {locale} classes="mb-4" />
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
