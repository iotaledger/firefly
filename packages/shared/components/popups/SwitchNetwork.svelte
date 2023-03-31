<script lang="typescript">
    import { get } from 'svelte/store'

    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { Button, Icon, Password, Spinner, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import {
        asyncCreateAccount,
        asyncRemoveWalletAccounts,
        asyncSetStrongholdPassword,
        wallet,
    } from 'shared/lib/wallet'
    import { getOfficialNodes, updateClientOptions } from 'shared/lib/network'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        updateProfile,
    } from 'shared/lib/profile'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { logout } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { ErrorType } from 'shared/lib/typings/events'

    import { Locale } from '@core/i18n'
    import { Network, NetworkConfig } from 'shared/lib/typings/network'
    import { Node } from 'shared/lib/typings/node'

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
        /**
         * NOTE: This check is made to prevent simultaneous requests to
         * delete an account being made (otherwise will return RecordNotFound
         * error from wallet.rs).
         */
        if (isSwitchingNetwork) return

        isSwitchingNetwork = true

        if ($isSoftwareProfile && $isStrongholdLocked) {
            await asyncSetStrongholdPassword(strongholdPassword)
        } else if ($isLedgerProfile && !isLedgerConnected()) {
            isSwitchingNetwork = false

            displayNotificationForLedgerProfile('warning')

            return
        }

        const oldAccounts = get($wallet.accounts)
        const oldConfig = $activeProfile?.settings?.networkConfig
        const newConfig = {
            ...oldConfig,
            network: network,
            nodes: [node],
            includeOfficialNodes: getOfficialNodes(network.type).find((n) => n.url === node?.url) !== undefined,
        } as NetworkConfig

        try {
            updateClientOptions(newConfig)
            updateProfile('settings.networkConfig', newConfig)

            await asyncRemoveWalletAccounts(get($wallet.accounts).map((a) => a.id))
            await asyncCreateAccount(`${locale('general.account')} 1`)
            await logout()
        } catch (err) {
            isSwitchingNetwork = false

            /**
             * CAUTION: Because an error has occurred at this point,
             * we must make sure to revert any changes to the wallet
             * (namely client options, network config, account data,
             * etc.)
             */
            $wallet.accounts.set(oldAccounts)
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
                message: locale(error?.error || error),
            })

            console.error(err)
        }
    }
</script>

<Text type="h4" classes="mb-9">{locale('popups.switchNetwork.title')}</Text>
<div class="w-full h-full {showPasswordInput ? '' : 'mb-2'}">
    <div class="flex flex-row justify-between">
        <div class="relative flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6 p-3">
            {#if !showPasswordInput}
                <Text type="p" secondary classes="self-start ml-4 mt-6">
                    {locale('popups.switchNetwork.newNetwork')}:
                    <Text highlighted classes="inline">{network.name}</Text>
                </Text>
            {/if}
            <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="warning" classes="text-white" />
            </div>
            <Text type="p" classes="dark:text-white ml-4 mb-4 {showPasswordInput ? 'mt-6' : 'mt-3'}">
                {locale('popups.switchNetwork.resetWarning')}
            </Text>
        </div>
    </div>
</div>
{#if showPasswordInput}
    <form id="stronghold-password-form" class="flex w-full flex-row flex-wrap mt-2 mb-9 justify-between">
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
            autofocus={!$mobile}
            submitHandler={handleConfirmNetworkSwitchClick}
            disabled={isSwitchingNetwork}
        />
    </form>
{/if}
<div
    class="flex flex-row justify-between space-x-4 w-full md:px-8"
    style="margin-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: margin-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
        'ms'} var(--transition-scroll)"
>
    <Button secondary classes="w-1/2" onClick={handleCancelNetworkSwitchClick} disabled={isSwitchingNetwork}>
        {locale('actions.cancel')}
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
                message={locale('popups.switchNetwork.switchingNetwork')}
                classes="justify-center"
            />
        {:else}
            {locale('actions.confirm')}
        {/if}
    </Button>
</div>
