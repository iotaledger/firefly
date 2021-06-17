<script lang="typescript">
    import { Button, OnboardingLayout, Text, Spinner, Icon, Number } from 'shared/components'
    import { onMount, createEventDispatcher, onDestroy } from 'svelte'
    import { Electron } from 'shared/lib/electron'
    import { getLedgerMigrationData } from 'shared/lib/migration'

    export let locale
    export let mobile
    export let steps

    let loading = false

    let index = 0

    function ledgerListener(isConnected) {
        console.log('Is connected', isConnected)
    }

    onMount(() => {
        Electron.ledger.addListener(ledgerListener)
    })

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        loading = true

        Electron.ledger
            .selectSeed(0, 0, 1)
            .then((iota) => {
                console.log('iota', iota)

                return getLedgerMigrationData(iota.getAddress)
            })
            .then(() => {
                loading = false
                dispatch('next')
            })
            .catch((error) => {
                loading = false
                console.error(error)
            })
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {steps}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.selectLedgerAccountIndex.title')}</Text>
            <Text type="p" secondary>{locale('views.selectLedgerAccountIndex.body')}</Text>
            <Number bind:value={index} autofocus classes="mt-8" />
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            <Button classes="w-full" onClick={handleContinueClick}>
                {#if loading}
                    <Spinner busy={true} message={locale('views.generateNewLedgerAddress.generating')} classes="justify-center" />
                {:else}{locale('actions.confirm')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
