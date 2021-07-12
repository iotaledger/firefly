<script>
    import { Button, Icon, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import {
        getLedgerDeviceStatus,
        ledgerDeviceState,
        ledgerSimulator,
        pollLedgerDeviceStatus,
        promptUserToConnectLedger,
        stopPollingLedgerStatus,
    } from 'shared/lib/ledger'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { openPopup } from 'shared/lib/popup'
    import { walletSetupType } from 'shared/lib/router'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { SetupType } from 'shared/lib/typings/routes'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'

    export let locale
    export let mobile

    let polling = false

    let legacyLedger = $walletSetupType === SetupType.TrinityLedger

    let newLedgerProfile = $walletSetupType === SetupType.New
    let busy = false

    let LEDGER_STATUS_POLL_INTERVAL = 1500

    let isConnected = false
    let isAppOpen = false

    $: isConnected = $ledgerDeviceState !== LedgerDeviceState.NotDetected
    $: isAppOpen = $ledgerDeviceState === LedgerDeviceState.Connected

    $: illustration = isConnected && isAppOpen ? 'ledger-connected-desktop' : 'ledger-disconnected-desktop'

    const dispatch = createEventDispatcher()

    onMount(() => {
        pollLedgerDeviceStatus(false, LEDGER_STATUS_POLL_INTERVAL, getLedgerDeviceStatus, getLedgerDeviceStatus)
        polling = true
    })

    onDestroy(stopPollingLedgerStatus)

    function createAccount() {
        const officialNodes = getOfficialNodes()
        const officialNetwork = getOfficialNetwork()

        const _onConnected = () =>
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
                    onSuccess() {
                        busy = false
                        dispatch('next')
                    },
                    onError(error) {
                        busy = false
                        console.error(error)
                    },
                }
            )
        const _onCancel = () => (busy = false)
        promptUserToConnectLedger(false, _onConnected, _onCancel)
    }

    function handlePopupOpen() {
        openPopup({
            type: 'ledgerConnectionGuide',
        })
    }

    function handleContinueClick() {
        busy = true
        if (newLedgerProfile) {
            createAccount()
        } else {
            const _onConnected = () => dispatch('next')
            const _onCancel = () => (busy = false)
            promptUserToConnectLedger(false, _onConnected, _onCancel)
        }
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout
        onBackClick={handleBackClick}
        {locale}
        showLedgerProgress={legacyLedger}
        showLedgerVideoButton={legacyLedger}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.connectLedger.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.connectLedger.body')}</Text>
            <div class="flex flex-col flex-nowrap space-y-2">
                <div class="flex flex-row items-center space-x-2">
                    <Icon
                        icon={`status-${isConnected ? 'success' : 'error'}`}
                        classes={`text-white bg-${isConnected ? 'green' : 'red'}-600 rounded-full`} />
                    <Text type="p" secondary>{locale('views.connectLedger.trafficLight1')}</Text>
                </div>
                <div class="flex flex-row items-center space-x-2">
                    <Icon
                        icon={`status-${isAppOpen ? 'success' : 'error'}`}
                        classes={`text-white bg-${isAppOpen ? 'green' : 'red'}-600 rounded-full`} />
                    <Text type="p" secondary>{locale('views.connectLedger.trafficLight2')}</Text>
                </div>
            </div>
        </div>
        <div slot="leftpane__action">
            <div on:click={handlePopupOpen} class="mb-10 flex flex-row justify-center cursor-pointer">
                <Icon icon="info" classes="mr-2 text-blue-500" />
                <Text secondary highlighted>{locale('popups.ledgerConnectionGuide.title')}</Text>
            </div>
            <Button classes="w-full" disabled={(polling && (!isConnected || !isAppOpen)) || busy} onClick={handleContinueClick}>
                {#if busy}
                    <Spinner busy message={locale('general.creatingAccount')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-gray-50 dark:bg-gray-900">
            <Illustration width="100%" {illustration} />
        </div>
    </OnboardingLayout>
{/if}
