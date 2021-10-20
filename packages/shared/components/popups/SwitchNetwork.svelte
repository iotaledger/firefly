<script lang="typescript">
    import { Button, Icon, Password, Spinner, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Network, NetworkConfig } from 'shared/lib/typings/network'
    import { closePopup } from 'shared/lib/popup'
    import {
        asyncCreateAccount,
        asyncRemoveWalletAccounts,
        asyncSetStrongholdPassword,
        resetWallet,
        wallet,
    } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { updateClientOptions } from 'shared/lib/network'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        updateProfile,
    } from 'shared/lib/profile'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { logout } from 'shared/lib/app'

    export let locale: Locale

    export let network: Network
    export let node: Node

    const showPasswordInput = $isSoftwareProfile && $isStrongholdLocked

    const error = ''
    let isSwitchingNetwork = false

    let strongholdPassword

    const handleCancelNetworkSwitchClick = (): void => {
        closePopup()
    }

    const handleConfirmNetworkSwitchClick = async (): Promise<void> => {
        isSwitchingNetwork = true

        if ($isSoftwareProfile && $isStrongholdLocked) {
            await asyncSetStrongholdPassword(strongholdPassword)
        } else if($isLedgerProfile && !isLedgerConnected()) {
            isSwitchingNetwork = false

            displayNotificationForLedgerProfile('warning')

            return
        }

        const newConfig = {
            ...$activeProfile?.settings?.networkConfig,
            network: network,
            nodes: [node],
        } as NetworkConfig

        try {
            await asyncRemoveWalletAccounts(get($wallet.accounts).map((a) => a.id))
            await asyncCreateAccount()

            resetWallet()
            updateClientOptions(newConfig)
            updateProfile('settings.networkConfig', newConfig)

            await logout()
        } catch (err) {
            isSwitchingNetwork = false

            console.error(err)
        }
    }
</script>

<Text type="h4" classes="mb-9">{locale('popups.switchNetwork.title')}</Text>
<div class="w-full h-full {$isSoftwareProfile && $isStrongholdLocked ? '' : 'mb-2'}">
    <div class="flex flex-row justify-between">
        <div class="relative flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6 p-3">
            <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="warning" classes="text-white" />
            </div>
            <Text type="p" classes="dark:text-white ml-4 mt-6 mb-4">
                {locale('popups.switchNetwork.resetWarning')}
            </Text>
        </div>
    </div>
</div>
{#if showPasswordInput}
<div class="flex w-full flex-row flex-wrap mt-2 mb-9 justify-between">
        <Text type="p" secondary classes="mb-3">
            {locale('popups.switchNetwork.typePassword')}
            <Text highlighted classes="inline">{network.name}</Text>
        </Text>
        <Password
            {error}
            classes="w-full mb-2"
            bind:value={strongholdPassword}
            showRevealToggle
            {locale}
            placeholder={locale('general.password')}
            autofocus
            submitHandler={handleConfirmNetworkSwitchClick}
            disabled={isSwitchingNetwork} />
</div>
{/if}
<div class="flex flex-row justify-between space-x-4 w-full px-8">
    <Button secondary classes="w-1/2" onClick={handleCancelNetworkSwitchClick} disabled={isSwitchingNetwork}>
        {locale('actions.cancel')}
    </Button>
    <Button warning classes="w-1/2" onClick={handleConfirmNetworkSwitchClick}>
    {#if isSwitchingNetwork}
        <Spinner busy message={locale('popups.switchNetwork.switchingNetwork')} classes="justify-center" />
    {:else}
        {locale('actions.confirm')}
    {/if}
    </Button>
</div>
