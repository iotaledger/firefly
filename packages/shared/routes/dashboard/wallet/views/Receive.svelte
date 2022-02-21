<script lang="typescript">
    import { Button, Dropdown, Icon, QR, Spinner, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, isLedgerProfile } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import type { AccountIdentifier } from 'shared/lib/typings/account'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { setClipboard } from 'shared/lib/utils'
    import { hasGeneratedALedgerReceiveAddress, isSyncing, selectedAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'

    export let isGeneratingAddress = false

    export let onGenerateAddress = (accountId: AccountIdentifier): void => {}

    const liveAccounts = getContext<Readable<WalletAccount[]>>('liveAccounts')

    let selectedSendAccount = $selectedAccount

    const handleDropdownSelect = (item: WalletAccount): void => {
        selectedSendAccount = item
    }
    const generateNewAddress = (): void => {
        onGenerateAddress(selectedSendAccount.id)
    }
    const handleCloseClick = (): void => {
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="w-full h-full flex flex-col justify-between {!$selectedAccount ? 'p-8' : ''}">
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
        {#if !$selectedAccount}
            <div>
                <div class="w-full flex flex-row justify-between items-start">
                    <Text type="h5" classes="mb-6">{localize('general.receiveFunds')}</Text>
                    <button on:click={handleCloseClick}>
                        <Icon icon="close" classes="text-gray-800 dark:text-white" />
                    </button>
                </div>
                <Dropdown
                    valueKey={'alias'}
                    value={selectedSendAccount.alias}
                    items={$liveAccounts}
                    onSelect={handleDropdownSelect}
                    disabled={$liveAccounts.length === 1}
                />
            </div>
        {/if}
        {#if $isLedgerProfile && !$hasGeneratedALedgerReceiveAddress}
            <div class="flex w-full h-full items-end">
                <Button
                    disabled={isGeneratingAddress || $isSyncing}
                    classes="w-full"
                    onClick={() => generateNewAddress()}
                >
                    {#if isGeneratingAddress}
                        <Spinner
                            busy={isGeneratingAddress}
                            message={localize('general.generatingReceiveAddress')}
                            classes="justify-center"
                        />
                    {:else}{localize('actions.generateAddress')}{/if}
                </Button>
            </div>
        {:else}
            <div
                class="receive-info w-full h-full flex flex-col flex-auto rounded-xl border border-solid border-gray-300 dark:border-gray-700 p-4"
            >
                <div class="w-full flex flex-row justify-between items-center mb-1">
                    <Text type="p" smaller bold>{localize('actions.receive')}</Text>
                    <button on:click={generateNewAddress} class:pointer-events-none={isGeneratingAddress}>
                        <Icon
                            icon="refresh"
                            classes="{isGeneratingAddress && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                        />
                    </button>
                </div>
                <div class="flex flex-auto items-center justify-center mb-4">
                    <QR size={98} data={selectedSendAccount.depositAddress} />
                </div>
                <div class="mb-6">
                    <Text secondary smaller classes="mb-1">
                        {$activeProfile?.isDeveloperProfile
                            ? `${$activeProfile.settings.networkConfig.network.name} ${localize('general.address')}`
                            : localize('general.myAddress')}
                    </Text>
                    <Text type="pre">{selectedSendAccount.depositAddress}</Text>
                </div>
                <Button
                    disabled={isGeneratingAddress}
                    classes="w-full"
                    onClick={() => setClipboard(selectedSendAccount.depositAddress)}
                >
                    {localize('general.copyAddress')}
                </Button>
            </div>
        {/if}
    </div>
</div>

<style type="text/scss">
    .receive-info {
        max-height: 350px;
    }
</style>
