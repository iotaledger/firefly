<script lang="typescript">
    import { Button, OnboardingLayout, Text, Spinner, Icon } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'

    export let locale
    export let mobile

    let newAddress = null
    let busy = false
    let confirmed = false
    let timeout // dummy

    const dispatch = createEventDispatcher()

    // TODO: dummy
    function generateNewAddress() {
        busy = true
        newAddress = null
        timeout = setTimeout(() => {
            newAddress = 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98' // dummy
            busy = false
        }, 2000)
    }

    function handleConfirmClick() {
        confirmed = true
    }

    function handleContinueClick() {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }

    onDestroy(() => {
        clearTimeout()
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            {#if confirmed}
                <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5 text-center">
                    <div class="bg-green-100 rounded-2xl relative -top-10">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-5 text-center">{locale('views.generateNewLedgerAddress.successTitle')}</Text>
                    <Text type="p" secondary classes="mb-2">{locale('views.generateNewLedgerAddress.successBody')}</Text>
                </div>
            {:else}
                <Text type="h2" classes="mb-5">{locale('general.generateNewAddress')}</Text>
                <Text type="p" secondary>{locale('views.generateNewLedgerAddress.body')}</Text>
                {#if newAddress}
                    <div class="mt-6 rounded-lg bg-gray-50 dark:bg-gray-700 p-4 text-center">
                        <Text type="pre">{newAddress}</Text>
                    </div>
                {/if}
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            {#if confirmed}
                <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.continue')}</Button>
            {:else}
                <Button classes="w-full" disabled={busy} secondary={newAddress} onClick={generateNewAddress}>
                    {#if busy}
                        <Spinner
                            busy={true}
                            message={locale('views.generateNewLedgerAddress.generating')}
                            classes="justify-center" />
                    {:else}{locale('actions.generateAddress')}{/if}
                </Button>
                {#if newAddress}
                    <Button classes="w-full" onClick={handleConfirmClick}>{locale('actions.confirm')}</Button>
                {/if}
            {/if}
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
