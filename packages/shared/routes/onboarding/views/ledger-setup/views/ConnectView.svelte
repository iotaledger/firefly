<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, Icon, Link, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ledgerSetupRouter } from '@core/router'
    import { profileRecoveryType, ProfileRecoveryType } from '@contexts/onboarding'
    import {
        ledgerDeviceStatus,
        stopPollingLedgerStatus,
        pollLedgerDeviceStatus,
        getLedgerDeviceStatus,
        displayNotificationForLedgerProfile,
        LedgerConnectionState,
    } from '@lib/ledger'
    import { openPopup } from '@lib/popup'

    const legacyLedger = $profileRecoveryType === ProfileRecoveryType.TrinityLedger

    let polling = false

    $: isConnected = $ledgerDeviceStatus.connectionState !== LedgerConnectionState.NotDetected
    $: isAppOpen = $ledgerDeviceStatus.connectionState === LedgerConnectionState.Connected
    $: animation = !isConnected
        ? 'ledger-disconnected-desktop'
        : isAppOpen
        ? 'ledger-connected-desktop'
        : 'ledger-app-closed-desktop'

    function _onCancel(): void {
        displayNotificationForLedgerProfile('error', true)
    }

    function _onConnected(): void {
        if ($ledgerDeviceStatus.connectionState !== LedgerConnectionState.Connected) {
            _onCancel()
        } else {
            $ledgerSetupRouter.next()
        }
    }

    function handleGuidePopup(): void {
        openPopup({
            type: 'ledgerConnectionGuide',
        })
    }

    function handleContinueClick(): void {
        getLedgerDeviceStatus(_onConnected, _onCancel, _onCancel)
    }

    function handleBackClick(): void {
        $ledgerSetupRouter.previous()
    }

    onMount(() => {
        pollLedgerDeviceStatus()
        polling = true
    })

    onDestroy(stopPollingLedgerStatus)
</script>

<OnboardingLayout onBackClick={handleBackClick} showLedgerProgress={legacyLedger} showLedgerVideoButton={legacyLedger}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.connectLedger.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.connectLedger.body')}</Text>
        <div class="flex flex-col flex-nowrap space-y-2">
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isConnected ? 'success' : 'error'}`}
                    classes={`text-white bg-${isConnected ? 'green' : 'red'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.trafficLight1')}</Text>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isAppOpen ? 'success' : 'error'}`}
                    classes={`text-white bg-${isAppOpen ? 'green' : 'red'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.trafficLight2')}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Link icon="info" onClick={handleGuidePopup} classes="mb-10 justify-center">
            {localize('popups.ledgerConnectionGuide.title')}
        </Link>
        <Button classes="w-full" disabled={polling && (!isConnected || !isAppOpen)} onClick={handleContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Animation
            width="100%"
            animation="ledger-bg-desktop"
            classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <Animation width="100%" {animation} />
    </div>
</OnboardingLayout>
