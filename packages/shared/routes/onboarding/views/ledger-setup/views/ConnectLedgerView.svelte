<script lang="typescript">
    import { onMount } from 'svelte'
    import { LedgerAnimation, Button, Icon, Link, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ledgerSetupRouter } from '@core/router'
    import {
        LedgerConnectionState,
        ledgerConnectionState,
        stopPollingLedgerNanoStatus,
        pollLedgerNanoStatus,
        getLedgerDeviceStatus,
        displayNotificationForLedgerProfile,
    } from '@core/ledger'
    import { openPopup } from '@lib/popup'
    import { initialiseFirstShimmerClaimingAccount, onboardingProfile, ProfileSetupType } from '@contexts/onboarding'

    let polling = false
    let isBusy = false

    $: isConnected = $ledgerConnectionState !== LedgerConnectionState.NotConnected
    $: isAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
    $: animation = !isConnected
        ? 'ledger-disconnected-desktop'
        : isAppOpen
        ? 'ledger-connected-desktop'
        : 'ledger-app-closed-desktop'

    function _onCancel(): void {
        displayNotificationForLedgerProfile('error', true)
    }

    async function _onConnected(): Promise<void> {
        if ($ledgerConnectionState !== LedgerConnectionState.CorrectAppOpen) {
            _onCancel()
        } else {
            isBusy = true
            const canInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.setupType === ProfileSetupType.Claimed
            const shouldInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.shimmerClaimingAccounts?.length < 1
            if (canInitialiseFirstShimmerClaimingAccount && shouldInitialiseFirstShimmerClaimingAccount) {
                await initialiseFirstShimmerClaimingAccount()
            }
            isBusy = false
            $ledgerSetupRouter.next()
        }
    }

    function handleGuidePopup(): void {
        openPopup({
            type: 'ledgerConnectionGuide',
        })
    }

    function onContinueClick(): void {
        void getLedgerDeviceStatus(_onConnected, _onCancel, _onCancel)
    }

    function onBackClick(): void {
        stopPollingLedgerNanoStatus()
        $ledgerSetupRouter.previous()
    }

    onMount(() => {
        pollLedgerNanoStatus()
        polling = true
    })
</script>

<OnboardingLayout {onBackClick}>
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
            classes="w-full flex flex-row justify-center items-center"
            disabled={polling && (!isConnected || !isAppOpen)}
            onClick={onContinueClick}
        >
            {#if isBusy}
                <Spinner busy={isBusy} message={`${localize('actions.initializing')}...`} />
            {:else}
                {localize('actions.continue')}
            {/if}
        </Button>
    </div>
    <LedgerAnimation slot="rightpane" {animation} />
</OnboardingLayout>
