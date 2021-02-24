<script lang="typescript">
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { writable } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Popup } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { newProfile, saveProfile } from 'shared/lib/profile'
    import { DEFAULT_NODES as nodes, DEFAULT_NODE as node, network } from 'shared/lib/network'
    import { popupState, openPopup, closePopup } from 'shared/lib/popup'
    import { LedgerStatus } from 'shared/lib/typings/wallet'

    export let locale
    export let mobile
    let creatingAccount = false
    let simulator = false
    let checkIfLedgerIsConnected = true
    let isLedgerConnected = true

    openPopup({
        type: 'ledgerNotConnected',
        props: {
            message: locale('views.setup_ledger.connect')
        }
    })

    const unsubscribe = popupState.subscribe(state => {
        if (!(state.active || isLedgerConnected)) {
            handleBackClick()
        }
    })

    onDestroy(() => {
        checkIfLedgerIsConnected = false
        unsubscribe()
    })

    const dispatch = createEventDispatcher()

    function getLedgerDeviceStatus() {
        api.getLedgerDeviceStatus(simulator, {
            onSuccess(response) {
                isLedgerConnected = response.payload.type === LedgerStatus.Connected
                if (isLedgerConnected) {
                    closePopup()
                } else if (checkIfLedgerIsConnected) {
                    setTimeout(getLedgerDeviceStatus, 1000)
                }
            },
            onError(e) {
                if (checkIfLedgerIsConnected) {
                    setTimeout(getLedgerDeviceStatus, 1000)
                }
            }
        })
    }

    getLedgerDeviceStatus()

    function createAccount() {
        creatingAccount = true
        api.createAccount(
            {
                clientOptions: {
                    node: node.url,
                    nodes: nodes.map((node) => node.url),
                    network: $network,
                },
                signerType: { type: simulator ? 'LedgerNanoSimulator' : 'LedgerNano' }
            },
            {
                onSuccess(createAccountResponse) {
                    saveProfile($newProfile)
                    newProfile.set(null)
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
        <Text type="p" secondary classes="mb-8">{locale('views.setup_ledger.body_1')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.setup_ledger.body_2')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.setup_ledger.body_3')}</Text>
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