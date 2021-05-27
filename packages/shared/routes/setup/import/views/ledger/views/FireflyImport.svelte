<script>
    import { Button, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { ledgerSimulator } from 'shared/lib/profile'
    import { LedgerStatus } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let restoring = false
    let isLedgerConnected = true
    let interval

    const dispatch = createEventDispatcher()

    onMount(() => {
        getLedgerDeviceStatus()
        interval = setInterval(() => {
            getLedgerDeviceStatus()
        }, 1000)
    })

    onDestroy(() => {
        if (interval) {
            clearTimeout(interval)
        }
    })

    function openLedgerNotConnectedPopup() {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                handleClose: handleClosePopup,
                message: locale('views.importFromLedger.ledgerNotConnected'),
            },
        })
    }

    function handleLedgerDeviceNotConnected() {
        if (!get(popupState).active) {
            openLedgerNotConnectedPopup()
        }
    }

    function getLedgerDeviceStatus() {
        api.getLedgerDeviceStatus(ledgerSimulator, {
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

    function restore() {
        restoring = true
        const officialNodes = getOfficialNodes()
        const officialNetwork = getOfficialNetwork()

        const _sync = () => {
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
                },
            })
        }

        api.getAccounts({
            onSuccess(accountsResponse) {
                if (accountsResponse.payload.length > 0) {
                    _sync()
                } else {
                    api.createAccount(
                        {
                            clientOptions: {
                                nodes: officialNodes,
                                node: officialNodes[Math.floor(Math.random() * officialNodes.length)],
                                network: officialNetwork,
                            },
                            alias: `${locale('general.account')} 1`,
                            signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
                        },
                        {
                            onSuccess(createAccountResponse) {
                                _sync()
                            },
                            onError(error) {
                                restoring = false
                                console.error(error)
                            },
                        }
                    )
                }
            },
            onError(errorResponse) {
                restoring = false
                console.error(error)
            },
        })
    }

    function handleClosePopup() {
        if (!isLedgerConnected) {
            closePopup()
            handleBackClick()
        }
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
