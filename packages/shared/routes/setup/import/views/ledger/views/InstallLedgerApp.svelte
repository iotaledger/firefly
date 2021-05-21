<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { LedgerStatus } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    let simulator = false
    let checkIfLedgerIsConnected = true
    let isLedgerConnected = true

    const dispatch = createEventDispatcher()

    const openLedgerNotConnectedPopup = () => {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                handleClose: handleClosePopup,
                message: locale('views.setupLedger.connect'),
            },
        })
    }

    onMount(() => {
        getLedgerDeviceStatus()
    })

    onDestroy(() => {
        checkIfLedgerIsConnected = false
    })

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

    function handleClosePopup() {
        if (!isLedgerConnected) {
            closePopup()
            handleBackClick()
        }
    }

    // TODO: missing functionality
    function handleContinueClick() {
        dispatch('next')
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
            <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
