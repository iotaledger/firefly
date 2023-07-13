<script lang="ts">
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { Subrouter } from '@core/router'
    import { Button, Icon, LedgerAnimation, Link, Text } from '@ui'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let router: Subrouter<unknown>

    const isBusy = false

    $: isNotConnected = $ledgerConnectionState === LedgerConnectionState.NotConnected
    $: isLocked = isNotConnected || $ledgerConnectionState === LedgerConnectionState.Locked
    $: isAppNotOpen = isLocked || $ledgerConnectionState === LedgerConnectionState.AppNotOpen
    $: isCorrectAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
    $: $ledgerConnectionState, setAnimation()

    let animation: string
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
            id: PopupId.LedgerConnection,
        })
    }

    function onContinueClick(): void {
        router.next()
    }

    function onBackClick(): void {
        router.previous()
    }
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
        <span class="flex justify-center mb-10">
            <Link icon={IconEnum.Info} on:click={handleGuidePopup}>
                {localize('popups.ledgerConnectionGuide.title')}
            </Link>
        </span>
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
