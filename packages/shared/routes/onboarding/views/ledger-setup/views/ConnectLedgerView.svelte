<script lang="typescript">
    import { onMount } from 'svelte'
    import { LedgerAnimation, Button, Icon, Link, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ledgerSetupRouter } from '@core/router'
    import {
        LedgerConnectionState,
        ledgerConnectionState,
        stopPollingLedgerNanoStatus,
        pollLedgerNanoStatus,
        displayNotificationForLedgerProfile,
    } from '@core/ledger'
    import { openPopup } from '@lib/popup'
    import { initialiseFirstShimmerClaimingAccount, onboardingProfile, ProfileSetupType } from '@contexts/onboarding'

    let isBusy = false

    $: isNotConnected = $ledgerConnectionState === LedgerConnectionState.NotConnected
    $: isLocked = isNotConnected || $ledgerConnectionState === LedgerConnectionState.Locked
    $: isAppNotOpen = isLocked || $ledgerConnectionState === LedgerConnectionState.AppNotOpen
    $: isCorrectAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen

    let animation: string
    $: $ledgerConnectionState, setAnimation()
    function setAnimation(): void {
        if (isNotConnected) {
            animation = 'ledger-disconnected-desktop'
        } else if (isLocked) {
            // TODO: Get animation for locked ledger
            animation = undefined
        } else if (isAppNotOpen) {
            animation = 'ledger-app-closed-desktop'
        } else if (isCorrectAppOpen) {
            animation = 'ledger-connected-desktop'
        }
    }

    function handleGuidePopup(): void {
        openPopup({
            type: 'ledgerConnectionGuide',
        })
    }

    async function onContinueClick(): Promise<void> {
        try {
            isBusy = true
            const canInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.setupType === ProfileSetupType.Claimed
            const shouldInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.shimmerClaimingAccounts?.length < 1
            if (canInitialiseFirstShimmerClaimingAccount && shouldInitialiseFirstShimmerClaimingAccount) {
                await initialiseFirstShimmerClaimingAccount()
            }
            $ledgerSetupRouter.next()
        } catch (err) {
            displayNotificationForLedgerProfile('error', true, true, err)
            console.error(err)
        } finally {
            isBusy = false
        }
    }

    function onBackClick(): void {
        stopPollingLedgerNanoStatus()
        $ledgerSetupRouter.previous()
    }

    onMount(() => {
        pollLedgerNanoStatus()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.connectLedger.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.connectLedger.body')}</Text>
        <div class="flex flex-col flex-nowrap space-y-2">
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isNotConnected ? 'error' : 'success'}`}
                    classes={`text-white bg-${isNotConnected ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.connect')}</Text>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isLocked ? 'error' : 'success'}`}
                    classes={`text-white bg-${isLocked ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.unlock')}</Text>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Icon
                    icon={`status-${isAppNotOpen ? 'error' : 'success'}`}
                    classes={`text-white bg-${isAppNotOpen ? 'red' : 'green'}-600 rounded-full`}
                />
                <Text type="p" secondary>{localize('views.connectLedger.openApp')}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Link icon="info" onClick={handleGuidePopup} classes="mb-10 justify-center">
            {localize('popups.ledgerConnectionGuide.title')}
        </Link>
        <Button
            classes="w-full flex flex-row justify-center items-center"
            disabled={!isCorrectAppOpen || isBusy}
            onClick={onContinueClick}
            {isBusy}
            busyMessage={`${localize('actions.initializing')}...`}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <LedgerAnimation {animation} />
    </div>
</OnboardingLayout>
