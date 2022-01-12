<script lang="typescript">
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { Button, Dropdown, Icon, QR, Spinner, Text } from 'shared/components'
    import type { AccountIdentifier } from 'shared/lib/typings/account'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { isLedgerProfile } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { setClipboard } from 'shared/lib/utils'
    import { hasGeneratedALedgerReceiveAddress, isSyncing } from 'shared/lib/wallet'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { activeProfile } from 'shared/lib/profile'


    export let locale: Locale

    export let isGeneratingAddress = false

    export let onGenerateAddress = (accountId: AccountIdentifier): void => {}

    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')
    const currentAccount = getContext<Readable<WalletAccount>>('selectedAccount')

    let selectedAccount = $currentAccount || $liveAccounts[0]

    const handleDropdownSelect = (item) => {
        selectedAccount = item
    }
    const generateNewAddress = () => {
        onGenerateAddress(selectedAccount.id)
    }
    const handleCloseClick = () => {
        walletRoute.set(WalletRoutes.Init)
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<style type="text/scss">
    .receive-info {
        max-height: 350px;
    }
</style>

<div class="w-full h-full flex flex-col justify-between {!$currentAccount ? 'p-8' : ''}">
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
        {#if !$currentAccount}
            <div>
                <div class="w-full flex flex-row justify-between items-start">
                    <Text type="h5" classes="mb-6">{locale('general.receiveFunds')}</Text>
                    <button on:click={handleCloseClick}>
                        <Icon icon="close" classes="text-gray-800 dark:text-white" />
                    </button>
                </div>
                <Dropdown
                    valueKey={'alias'}
                    value={selectedAccount.alias}
                    items={$liveAccounts}
                    onSelect={handleDropdownSelect}
                    disabled={$liveAccounts.length === 1} />
            </div>
        {/if}
        {#if $isLedgerProfile && !$hasGeneratedALedgerReceiveAddress}
            <div class="flex w-full h-full items-end">
                <Button disabled={isGeneratingAddress || $isSyncing} classes="w-full" onClick={() => generateNewAddress()}>
                    {#if isGeneratingAddress}
                        <Spinner
                            busy={isGeneratingAddress}
                            message={locale('general.generatingReceiveAddress')}
                            classes="justify-center" />
                    {:else}
                        {locale('actions.generateAddress')}
                    {/if}
                </Button>
            </div>
        {:else}
            <div
                class="receive-info w-full h-full flex flex-col flex-auto rounded-xl border border-solid border-gray-300 dark:border-gray-700 p-4">
                <div class="w-full flex flex-row justify-between items-center mb-1">
                    <Text type="p" smaller bold>{locale('actions.receive')}</Text>
                    <button on:click={generateNewAddress} class:pointer-events-none={isGeneratingAddress}>
                        <Icon
                            icon="refresh"
                            classes="{isGeneratingAddress && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
                    </button>
                </div>
                <div class="flex flex-auto items-center justify-center mb-4">
                    <QR size={98} data={selectedAccount.depositAddress} />
                </div>
                <div class="mb-6">
                    <Text secondary smaller classes="mb-1">{ $activeProfile?.isDeveloperProfile ? `${$activeProfile.settings.networkConfig.network.name} ${locale('general.address')}` : locale('general.myAddress')}</Text>
                    <Text type="pre">{selectedAccount.depositAddress}</Text>
                </div>
                <Button
                    disabled={isGeneratingAddress}
                    classes="w-full"
                    onClick={() => setClipboard(selectedAccount.depositAddress)}>
                    {locale('general.copyAddress')}
                </Button>
            </div>
        {/if}
    </div>
</div>
