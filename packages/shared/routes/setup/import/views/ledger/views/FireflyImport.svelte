<script>
    import { Button, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { LedgerStatus } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const openLedgerNotConnectedPopup = () => {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                message: locale('views.importFromLedger.ledgerNotConnected'),
            },
        })
    }

    let restoring = false
    let simulator = false
    let checkIfLedgerIsConnected = true
    let isLedgerConnected = true

    const unsubscribe = popupState.subscribe((state) => {
        if (!(state.active || isLedgerConnected)) {
            checkIfLedgerIsConnected = false
            handleBackClick()
        }
    })

    onDestroy(() => {
        checkIfLedgerIsConnected = false
        unsubscribe()
    })

    const dispatch = createEventDispatcher()

    function handleLedgerDeviceNotConnected() {
        if (checkIfLedgerIsConnected) {
            if (!get(popupState).active) {
                openLedgerNotConnectedPopup()
            }
            setTimeout(getLedgerDeviceStatus, 1000)
        }
    }

    function getLedgerDeviceStatus() {
        api.getLedgerDeviceStatus(simulator, {
            onSuccess(response) {
                isLedgerConnected = response.payload.type === LedgerStatus.Connected
                if (isLedgerConnected) {
                    closePopup()
                } else {
                    handleLedgerDeviceNotConnected()
                }
            },
            onError() {
                handleLedgerDeviceNotConnected()
            },
        })
    }

    getLedgerDeviceStatus()

    function restore() {
        restoring = true
        const officialNodes = getOfficialNodes()
        const officialNetwork = getOfficialNetwork()
        api.createAccount(
            {
                clientOptions: {
                    nodes: officialNodes,
                    node: officialNodes[Math.floor(Math.random() * officialNodes.length)],
                    network: officialNetwork,
                },
                alias: `${locale('general.account')} 1`,
                signerType: { type: simulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
            },
            {
                onSuccess(createAccountResponse) {
                    api.syncAccounts({
                        onSuccess(syncAccountsResponse) {
                            let balance = 0
                            for (const syncedAccount of syncAccountsResponse.payload) {
                                const accountBalance = syncedAccount.addresses.reduce(
                                    (total, address) => total + address.balance,
                                    0
                                )
                                balance += accountBalance
                            }
                            restoring = false
                            dispatch('next', { balance })
                        },
                        onError(error) {
                            restoring = false
                            console.error(error)
                        },
                    })
                },
                onError(error) {
                    restoring = false
                    console.error(error)
                },
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
            <Text type="h2" classes="mb-5">{locale('views.importFromFireflyLedger.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromFireflyLedger.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={restoring} onClick={restore}>
                {#if restoring}
                    <Spinner busy message={locale('views.importFromFireflyLedger.restoring')} classes="justify-center" />
                {:else}{locale('actions.restore')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
