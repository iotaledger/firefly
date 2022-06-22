<script lang="typescript">
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { Animation, Button, Icon, Link, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getDefaultClientOptions } from '@core/network'
    import { activeProfile } from '@core/profile'
    import {
        displayNotificationForLedgerProfile,
        getLedgerDeviceStatus,
        ledgerDeviceState,
        ledgerSimulator,
        pollLedgerDeviceStatus,
        stopPollingLedgerStatus,
    } from '@lib/ledger'
    import { openPopup } from '@lib/popup'
    import { api, walletSetupType } from '@lib/wallet'
    import { LedgerDeviceState } from '@lib/typings/ledger'
    import { SetupType } from '@lib/typings/setup'

    const dispatch = createEventDispatcher()
    const legacyLedger = $walletSetupType === SetupType.TrinityLedger
    const newLedgerProfile = $walletSetupType === SetupType.New
    const LEDGER_STATUS_POLL_INTERVAL = 1500

    let polling = false
    let isConnected = false
    let isAppOpen = false
    let creatingAccount = false

    $: isConnected = $ledgerDeviceState !== LedgerDeviceState.NotDetected
    $: isAppOpen = $ledgerDeviceState === LedgerDeviceState.Connected
    $: animation = !isConnected
        ? 'ledger-disconnected-desktop'
        : isAppOpen
        ? 'ledger-connected-desktop'
        : 'ledger-app-closed-desktop'

    onMount(() => {
        pollLedgerDeviceStatus(false, LEDGER_STATUS_POLL_INTERVAL)
        polling = true
    })

    onDestroy(stopPollingLedgerStatus)

    function createAccount(): void {
        creatingAccount = true

        // TODO: refactor this for new bindingsx
        api.createAccount(
            {
                clientOptions: getDefaultClientOptions($activeProfile?.networkProtocol),
                alias: `${localize('general.account')} 1`,
                signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
            },
            {
                onSuccess() {
                    creatingAccount = false

                    dispatch('next')
                },
                onError(error) {
                    creatingAccount = false

                    console.error(error)

                    displayNotificationForLedgerProfile('error', true, true, false, false, error)
                },
            }
        )
    }

    function _onCancel(): void {
        creatingAccount = false
        displayNotificationForLedgerProfile('error', true)
    }

    function _onConnected(): void {
        if ($ledgerDeviceState !== LedgerDeviceState.Connected) {
            _onCancel()
        } else {
            dispatch('next')
        }
    }

    function handleGuidePopup(): void {
        openPopup({
            type: 'ledgerConnectionGuide',
        })
    }

    function handleContinueClick(): void {
        creatingAccount = true

        if (newLedgerProfile) {
            createAccount()
        } else {
            getLedgerDeviceStatus(false, _onConnected, _onCancel, _onCancel)
        }
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
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
        <Button
            classes="w-full"
            disabled={(polling && (!isConnected || !isAppOpen)) || creatingAccount}
            onClick={handleContinueClick}
        >
            {#if creatingAccount}
                <Spinner busy message={localize('general.creatingAccount')} classes="justify-center" />
            {:else}{localize('actions.continue')}{/if}
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
