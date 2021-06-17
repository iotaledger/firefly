<script lang="typescript">
    import { Button, OnboardingLayout, Text, Spinner, Icon, Number, Toggle } from 'shared/components'
    import { onMount, createEventDispatcher, onDestroy } from 'svelte'
    import { Electron } from 'shared/lib/electron'
    import { getLedgerMigrationData, ledgerMigrationProgresses, ADDRESS_SECURITY_LEVEL } from 'shared/lib/migration'

    export let locale
    export let mobile

    let loading = false

    let index = 0
    let page = 0
    let expert = false

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
            .selectSeed(index, page, ADDRESS_SECURITY_LEVEL)
            .then((iota) => {
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
    <OnboardingLayout onBackClick={handleBackClick} progress={$ledgerMigrationProgresses}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.selectLedgerAccountIndex.title')}</Text>
            <Text type="p" secondary>{locale('views.selectLedgerAccountIndex.body')}</Text>
            <div class="flex flex-col space-y-4 mt-8">
                <div class="flex row space-x-2 items-center">
                    <Text type="p" smaller highlighted={!expert}>{locale('views.selectLedgerAccountIndex.standard')}</Text>
                    <Toggle
                        active={expert}
                        onClick={() => {
                            expert = !expert
                        }}
                        classes="cursor-pointer" />
                    <Text type="p" smaller highlighted={expert}>{locale('views.selectLedgerAccountIndex.expert')}</Text>
                </div>
                <div>
                    <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountIndex')}</Text>
                    <Number bind:value={index} />
                </div>
                {#if expert}
                    <div>
                        <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountPage')}</Text>
                        <Number bind:value={page} />
                    </div>
                {/if}
            </div>
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
