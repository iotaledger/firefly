<script>
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { writable } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Popup } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODES as nodes } from 'shared/lib/network'
    import { popupState, openPopup, closePopup } from 'shared/lib/popup'

    export let locale
    export let mobile
    let creatingAccount = false
    let simulator = false
    let checkIfLedgerIsOpened = true
    let isLedgerOpened = false

    openPopup({
        type: 'ledgerNotConnected',
        props: {
            message: locale('views.setup_ledger.connect')
        }
    })

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

    function createAccount() {
        creatingAccount = true
        api.createAccount(
            {
                clientOptions: { nodes },
                signerType: { type: simulator ? 'LedgerNanoSimulator' : 'LedgerNano' }
            },
            {
                onSuccess(createAccountResponse) {
                    creatingAccount = false
                    dispatch('next')
                },
                onError(error) {
                    creatingAccount = false
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
        <Text type="h2" classes="mb-5">{locale('views.setup_ledger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.setup_ledger.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={creatingAccount} onClick={createAccount}>
            {locale(creatingAccount ? 'actions.continue' : 'actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <Illustration illustration="import-from-firefly-ledger-desktop" height="100%" width="auto"
            classes="h-full object-cover object-left" />
    </div>
</OnboardingLayout>
{/if}
