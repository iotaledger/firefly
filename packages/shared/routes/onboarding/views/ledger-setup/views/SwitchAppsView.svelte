<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { promptUserToConnectLedger, displayNotificationForLedgerProfile, ledgerDeviceState } from '@lib/ledger'
    import { LedgerAppName, LedgerDeviceState } from '@lib/typings/ledger'

    export let busy = false

    const dispatch = createEventDispatcher()

    function handleContinueClick(): void {
        busy = true

        function _onCancel(): void {
            busy = false

            displayNotificationForLedgerProfile('error', true, true, true)
        }

        function _onConnected(): void {
            if ($ledgerDeviceState !== LedgerDeviceState.LegacyConnected) _onCancel()
            else dispatch('next')
        }

        promptUserToConnectLedger(_onConnected, _onCancel)
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.switchLedgerApps.title')}</Text>
        <Text type="p" secondary classes="mb-5">
            {localize('views.switchLedgerApps.body', { values: { legacy: LedgerAppName.IOTALegacy } })}
        </Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-40">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="ledger-app" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.IOTA}</Text>
            </div>
            <Icon icon="chevron-right" classes="-mt-6 text-blue-400" />
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="ledger-app-legacy" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.IOTALegacy}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={busy} onClick={handleContinueClick}>{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Animation
            width="100%"
            animation="ledger-bg-desktop"
            classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <Animation width="100%" animation="ledger-switch-app-desktop" />
    </div>
</OnboardingLayout>
