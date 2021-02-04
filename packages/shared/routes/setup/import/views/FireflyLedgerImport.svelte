<script>
    import { createEventDispatcher, onDestroy, setContext } from 'svelte'
    import { writable } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Popup } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { popupState, openPopup, closePopup } from 'shared/lib/popup'

    export let locale
    export let mobile
    openPopup({
        type: 'ledgerNotConnected',
        props: {
            message: locale('views.import_from_ledger.ledger_not_connected')
        }
    })

    let restoring = false
    let simulator = false
    let checkIfLedgerIsOpened = true
    let isLedgerOpened = false

    const unsubscribe = popupState.subscribe(state => {
        if (!(state.active || isLedgerOpened)) {
            handleBackClick()
        }
    })

    onDestroy(() => {
        checkIfLedgerIsOpened = false
        unsubscribe()
    })

    const dispatch = createEventDispatcher()

    function openLedgerApp() {
        api.openLedgerApp(simulator, {
            onSuccess() {
                isLedgerOpened = true
                closePopup()
            },
            onError() {
                if (checkIfLedgerIsOpened) {
                    setTimeout(openLedgerApp, 1000)
                }
            }
        })
    }

    openLedgerApp()

    function restore() {
        restoring = true
        api.createAccount(
            {
                clientOptions: { nodes },
                signerType: { type: simulator ? 'LedgerNanoSimulator' : 'LedgerNano' }
            },
            {
                onSuccess(createAccountResponse) {
                    api.syncAccounts({
                        onSuccess(syncAccountsResponse) {
                            let balance = 0
                            for (const syncedAccount of syncAccountsResponse.payload) {
                                const accountBalance = syncedAccount.addresses.reduce((total, address) => total + address.balance, 0)
                                balance += accountBalance
                            }
                            restoring = false
                            dispatch('next', { balance })
                        },
                        onError(error) {
                            restoring = false
                            console.error(error)
                        }
                    })
                },
                onError(error) {
                    restoring = false
                    console.error(error);
                }
            }
        )
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
<div>foo</div>
{:else}
<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{locale('views.import_from_firefly_ledger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.import_from_firefly_ledger.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={restoring} onClick={restore}>
            {locale(restoring ? 'views.import_from_firefly_ledger.restoring' : 'actions.restore')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <Illustration illustration="import-from-firefly-ledger-desktop" height="100%" width="auto"
            classes="h-full object-cover object-left" />
    </div>
</OnboardingLayout>
{/if}
