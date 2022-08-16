<script type="typescript">
    import { Animation, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ledgerSetupRouter } from '@core/router'
    import { promptUserToConnectLedger } from '@lib/ledger'

    let restoring = false

    function restore(): void {
        restoring = true
        function _onConnected(): void {
            // api.getAccounts({
            //     onSuccess(accountsResponse) {
            //         if (accountsResponse.payload.length === 0) {
            //             api.createAccount(
            //                 {
            //                     clientOptions: getDefaultClientOptions($activeProfile?.networkProtocol),
            //                     alias: `${localize('general.account')} 1`,
            //                     signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
            //                 },
            //                 {
            //                     onSuccess() {
            //                         restoring = false
            //                         dispatch('next')
            //                     },
            //                     onError(error) {
            //                         restoring = false
            //                         console.error(error)
            //                         displayNotificationForLedgerProfile('error', true, true, false, false, error)
            //                     },
            //                 }
            //             )
            //         }
            //     },
            //     onError(error) {
            //         restoring = false
            //         console.error(error)
            //     },
            // })
        }
        function _onCancel() {
            restoring = false
        }
        promptUserToConnectLedger(false, _onConnected, _onCancel)
    }
    function handleBackClick(): void {
        $ledgerSetupRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} busy={restoring}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.restoreFromFireflyLedger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{localize('views.restoreFromFireflyLedger.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={restoring} onClick={restore}>
            {#if restoring}
                <Spinner busy message={localize('views.restoreFromFireflyLedger.restoring')} classes="justify-center" />
            {:else}{localize('actions.restore')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
