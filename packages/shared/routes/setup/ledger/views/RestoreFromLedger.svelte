<script type="typescript">
    import { Animation, Button, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { displayNotificationForLedgerProfile, ledgerSimulator, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { getDefaultClientOptions } from 'shared/lib/network'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    let restoring = false

    const dispatch = createEventDispatcher()

    function restore() {
        restoring = true

        const _onConnected = () =>
            api.getAccounts({
                onSuccess(accountsResponse) {
                    if (accountsResponse.payload.length === 0) {
                        api.createAccount(
                            {
                                clientOptions: getDefaultClientOptions(),
                                alias: `${locale('general.account')} 1`,
                                signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
                            },
                            {
                                onSuccess(createAccountResponse) {
                                    restoring = false
                                    dispatch('next')
                                },
                                onError(error) {
                                    restoring = false

                                    console.error(error)

                                    displayNotificationForLedgerProfile('error', true, true, false, false, error)
                                },
                            }
                        )
                    }
                },
                onError(error) {
                    restoring = false
                    console.error(error)
                },
            })
        const _onCancel = () => (restoring = false)

        promptUserToConnectLedger(false, _onConnected, _onCancel)
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} busy={restoring}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{locale('views.restoreFromFireflyLedger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.restoreFromFireflyLedger.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={restoring} onClick={restore}>
            {#if restoring}
                <Spinner busy message={locale('views.restoreFromFireflyLedger.restoring')} classes="justify-center" />
            {:else}{locale('actions.restore')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
