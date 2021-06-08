<script lang="typescript">
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

    let creatingAccount = false
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
                message: locale('views.setupLedger.connect'),
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

    function createAccount() {
        creatingAccount = true
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
                signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
            },
            {
                onSuccess(createAccountResponse) {
                    creatingAccount = false
                    dispatch('next')
                },
                onError(error) {
                    creatingAccount = false
                    console.error(error)
                },
            }
        )
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
            <Text type="h2" classes="mb-5">{locale('views.setupLedger.title')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body1')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body2')}</Text>
            <Text type="p" secondary>{locale('views.setupLedger.body3')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={creatingAccount} onClick={createAccount}>
                {#if creatingAccount}
                    <Spinner busy message={locale('general.creatingAccount')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
