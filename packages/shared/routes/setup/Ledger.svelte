<script>
    import { createEventDispatcher, onDestroy, setContext } from 'svelte'
    import { writable } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Popup } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODES as nodes } from 'shared/lib/network'

    export let locale
    export let mobile
    const popupState = writable({
        active: true,
        type: 'ledgerNotConnected',
        props: {
            message: locale('views.setup_ledger.connect')
        }
    })
    setContext('popupState', popupState)
    let creatingAccount = false
    let simulator = true
    let checkIfLedgerIsOpened = true
    let isLedgerOpened = false

    popupState.subscribe(state => {
        if (!(state.active || isLedgerOpened)) {
            handleBackClick()
        }
    })

    onDestroy(() => {
        checkIfLedgerIsOpened = false
    })

    const dispatch = createEventDispatcher()

    function openLedgerApp() {
        api.openLedgerApp(simulator, {
            onSuccess() {
                isLedgerOpened = true
                popupState.set({ active: false })
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
{#if $popupState.active}
<Popup type={$popupState.type} props={$popupState.props} {locale} />
{/if}
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
