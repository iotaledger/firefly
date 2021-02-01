<script>
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { writable } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Popup } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'

    export let locale
    export let mobile
    let creatingAccount = false
    let showOpenLedgerDialog = true
    let hasOpenedLedger = false
    let simulator = true
    let checkIfLedgerIsOpened = true

    onDestroy(() => {
        checkIfLedgerIsOpened = false
    })

    const dispatch = createEventDispatcher()

    function openLedgerApp() {
        api.openLedgerApp(simulator, {
            onSuccess() {
                hasOpenedLedger = true
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
                clientOptions: { node, nodes },
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

    $: if (!showOpenLedgerDialog) {
        handleBackClick()
    }
</script>

{#if mobile}
<div>foo</div>
{:else}
{#if !hasOpenedLedger}
<Popup bind:active={showOpenLedgerDialog} {locale} type="ledgerNotConnected"
    data={locale('views.setup_ledger.connect')} />
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