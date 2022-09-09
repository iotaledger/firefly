<script lang="typescript">
    import { handleDeepLink } from '@auxiliary/deep-link'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import {
        activeProfile,
        hasStrongholdLocked,
        isActiveLedgerProfile,
        logout,
        reflectLockedStronghold,
        saveActiveProfile,
    } from '@core/profile'
    import { appRouter, dashboardRoute } from '@core/router'
    import { Idle, Sidebar } from 'shared/components'
    import { stopPollingLedgerNanoStatus } from '@core/ledger'
    import { removeDisplayNotification, showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { Developer, Settings, Staking, Wallet } from 'shared/routes'
    import { onDestroy, onMount } from 'svelte'
    import TopNavigation from './TopNavigation.svelte'
    import { closePopup, openPopup } from '@lib/popup'

    $: $activeProfile, saveActiveProfile()

    const tabs = {
        wallet: Wallet,
        settings: Settings,
        staking: Staking,
        developer: Developer,
    }

    let fundsSoonNotificationId
    let developerProfileNotificationId

    onMount(() => {
        Platform.onEvent('menu-logout', () => {
            void logout()
        })

        Platform.onEvent('deep-link-params', (data: string) => {
            handleDeepLinkRequest(data)
        })

        Platform.DeepLinkManager.checkDeepLinkRequestExists()

        if ($activeProfile?.isDeveloperProfile && !developerProfileNotificationId) {
            // Show developer profile warning
            developerProfileNotificationId = showAppNotification({
                type: 'warning',
                message: localize('indicators.developerProfileIndicator.warningText', {
                    values: { networkName: $nodeInfo?.protocol?.networkName },
                }),
            })
        }
    })

    onDestroy(() => {
        Platform.DeepLinkManager.clearDeepLinkRequest()
        Platform.removeListenersForEvent('deep-link-params')

        if (fundsSoonNotificationId) {
            removeDisplayNotification(fundsSoonNotificationId)
        }
        if (developerProfileNotificationId) {
            removeDisplayNotification(developerProfileNotificationId)
        }
        if ($isActiveLedgerProfile) {
            stopPollingLedgerNanoStatus()
        }
    })

    // TODO: handle deep link requests for new send form
    const handleDeepLinkRequest = (data: string): void => {
        if ($activeProfile?.hasLoadedAccounts) {
            openPopup({
                type: 'accountSwitcher',
                overflow: true,
                props: {
                    onConfirm: () => {
                        closePopup()
                        handleDeepLink(data)
                    },
                },
            })
        }
    }

    $: $hasStrongholdLocked && reflectLockedStronghold()
</script>

<Idle />
<div class="dashboard-wrapper flex flex-col w-full h-full">
    <TopNavigation />
    <div class="flex flex-row flex-auto h-1">
        <Sidebar />
        <!-- Dashboard Pane -->
        <div class="flex flex-col w-full h-full">
            <svelte:component this={tabs[$dashboardRoute]} locale={localize} on:next={$appRouter.next} />
        </div>
    </div>
</div>

<style type="text/scss">
    :global(:not(body.platform-win32)) .dashboard-wrapper {
        margin-top: calc(env(safe-area-inset-top) / 2);
    }
</style>
