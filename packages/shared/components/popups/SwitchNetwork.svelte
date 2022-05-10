<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Icon, Password, Spinner, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { createAccount, asyncRemoveWalletAccounts, setStrongholdPassword } from 'shared/lib/wallet'
    import { updateClientOptions, INetwork, INetworkConfig, INode } from '@core/network'
    import { getOfficialNodes } from '@core/network/utils'
    import { isLedgerProfile, isSoftwareProfile, isStrongholdLocked, updateProfile } from 'shared/lib/profile'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { logout } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { ErrorType } from 'shared/lib/typings/events'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'

    export let network: INetwork
    export let node: INode

    const showPasswordInput = $isSoftwareProfile && $isStrongholdLocked

    const error = ''
    let isSwitchingNetwork = false
    let strongholdPassword: string

    const handleCancelNetworkSwitchClick = (): void => {
        closePopup()
    }

    const handleConfirmNetworkSwitchClick = async (): Promise<void> => {
        /**
         * NOTE: This check is made to prevent simultaneous requests to
         * delete an account being made (otherwise will return RecordNotFound
         * error from wallet.rs).
         */
        if (isSwitchingNetwork) return

        isSwitchingNetwork = true

        if ($isSoftwareProfile && $isStrongholdLocked) {
            await setStrongholdPassword(strongholdPassword)
        } else if ($isLedgerProfile && !isLedgerConnected()) {
            isSwitchingNetwork = false

            displayNotificationForLedgerProfile('warning')

            return
        }

        const oldAccounts = get($activeProfile.accounts)
        const oldConfig = $activeProfile?.settings?.networkConfig
        const newConfig = {
            ...oldConfig,
            network: network,
            nodes: [node],
            includeOfficialNodes:
                getOfficialNodes(network.protocol, network.type).find((n) => n.url === node?.url) !== undefined,
        } as INetworkConfig

        try {
            updateClientOptions(newConfig)
            updateProfile('settings.networkConfig', newConfig)

            await asyncRemoveWalletAccounts(get($activeProfile.accounts).map((a) => a.id))
            await createAccount(`${localize('general.account')} 1`)
            await logout()
        } catch (err) {
            isSwitchingNetwork = false

            /**
             * CAUTION: Because an error has occurred at this point,
             * we must make sure to revert any changes to the wallet
             * (namely client options, network config, account data,
             * etc.)
             */
            $activeProfile.accounts.set(oldAccounts)
            updateClientOptions(oldConfig)
            updateProfile('settings.networkConfig', oldConfig)

            /**
             * NOTE: It is necessary to override the default locale paths
             * for some wallet.rs errors as they're more specific in the
             * context of network configuration.
             */
            let error
            switch (err?.type) {
                case ErrorType.AccountNotEmpty:
                    error = 'error.network.nonEmptyAccount'
                    break
                default:
                    error = err
                    break
            }
            showAppNotification({
                type: 'error',
                message: localize(error?.error || error),
            })

            console.error(err)
        }
    }
</script>

<Text type="h4" classes="mb-9">{localize('popups.switchNetwork.title')}</Text>
<div class="w-full h-full {showPasswordInput ? '' : 'mb-2'}">
    <div class="flex flex-row justify-between">
        <div class="relative flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6 p-3">
            {#if !showPasswordInput}
                <Text type="p" secondary classes="self-start ml-4 mt-6">
                    {localize('popups.switchNetwork.newNetwork')}:
                    <Text highlighted classes="inline">{network.name}</Text>
                </Text>
            {/if}
            <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="warning" classes="text-white" />
            </div>
            <Text type="p" classes="dark:text-white ml-4 mb-4 {showPasswordInput ? 'mt-6' : 'mt-3'}">
                {localize('popups.switchNetwork.resetWarning')}
            </Text>
        </div>
    </div>
</div>
{#if showPasswordInput}
    <form id="stronghold-password-form" class="flex w-full flex-row flex-wrap mt-2 mb-9 justify-between">
        <Text type="p" secondary classes="mb-3">
            {localize('popups.switchNetwork.typePassword')}
            <Text highlighted classes="inline">{network.name}</Text>
        </Text>
        <Password
            {error}
            classes="w-full mb-2"
            bind:value={strongholdPassword}
            showRevealToggle
            locale={localize}
            placeholder={localize('general.password')}
            autofocus
            submitHandler={handleConfirmNetworkSwitchClick}
            disabled={isSwitchingNetwork}
        />
    </form>
{/if}
<div class="flex flex-row justify-between space-x-4 w-full md:px-8">
    <Button secondary classes="w-1/2" onClick={handleCancelNetworkSwitchClick} disabled={isSwitchingNetwork}>
        {localize('actions.cancel')}
    </Button>
    <Button
        warning
        type="submit"
        form={showPasswordInput ? 'stronghold-password-form' : ''}
        classes="w-1/2"
        onClick={handleConfirmNetworkSwitchClick}
    >
        {#if isSwitchingNetwork}
            <Spinner
                busy={isSwitchingNetwork}
                message={localize('popups.switchNetwork.switchingNetwork')}
                classes="justify-center"
            />
        {:else}
            {localize('actions.confirm')}
        {/if}
    </Button>
</div>
