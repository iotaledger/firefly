<script lang="typescript">
    import { Button, Dropdown, Icon, QR, Text } from 'shared/components'
    import { setClipboard } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import type { Account } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable, Writable } from 'svelte/store'

    export let locale
    export let generateAddress = (accountId) => {}
    export let isGeneratingAddress = false

    const accounts = getContext<Writable<Account[]>>('walletAccounts')
    const currentAccount = getContext<Readable<Account>>('selectedAccount')

    $: selectedAccount = $currentAccount || $accounts[0]


    const handleDropdownSelect = (item) => {
        selectedAccount = item
    }
    const generateNewAddress = () => {
        generateAddress(selectedAccount.id)
    }
    const handleCloseClick = () => {
        walletRoute.set(WalletRoutes.Init)
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="w-full h-full flex flex-col justify-between {!$currentAccount ? 'p-8' : ''}">
    <div class="w-full h-full space-y-10 flex flex-auto flex-col flex-shrink-0">
        {#if !$currentAccount}
            <div>
                <div class="w-full flex flex-row justify-between items-start">
                    <Text type="h5" classes="mb-6">{locale('general.receive_funds')}</Text>
                    <button on:click={handleCloseClick}>
                        <Icon icon="close" classes="text-gray-800 dark:text-white" />
                    </button>
                </div>
                <Dropdown valueKey={'name'} value={selectedAccount.alias} items={$accounts} onSelect={handleDropdownSelect} />
            </div>
        {/if}
        <div
            class="w-full h-full flex flex-col flex-auto rounded-2xl border border-solid border-gray-300 dark:border-gray-700 p-4">
            <div class="w-full flex flex-row justify-between items-start">
                <Text type="p" smaler bold classes="mb-4">{locale('actions.receive')}</Text>
                <button on:click={generateNewAddress}>
                    <Icon icon="refresh" classes="text-gray-500 dark:text-white" />
                </button>
            </div>
            <div class="flex flex-auto items-center justify-center mb-6">
                <QR size={98} data={selectedAccount.depositAddress} />
            </div>
            <div class="mb-6">
                <Text secondary smaller classes="mb-1">{locale('general.my_address')}</Text>
                <Text type="pre">{selectedAccount.depositAddress}</Text>
            </div>
            <Button
                disabled={isGeneratingAddress}
                classes="w-full"
                onClick={() => setClipboard(selectedAccount.depositAddress)}>
                {locale('general.copy_address')}
            </Button>
        </div>
    </div>
</div>
