<script lang="typescript">
    import { Button, Number, OnboardingLayout, Text, Toggle } from 'shared/components'
    import { ledgerMigrationProgresses } from 'shared/lib/migration'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    let index = 0
    let page = 0
    let expert = false

    let isLedgerConnected = true

    const dispatch = createEventDispatcher()

    onMount(() => {
        // dummy, just to show popup
        openLegacyLedgerNotConnectedPopup()
    })

    function openLegacyLedgerNotConnectedPopup() {
        openPopup({
            type: 'ledgerNotConnected',
            hideClose: true,
            props: {
                handleClose: handleClosePopup,
                message: locale('views.setupLedger.connectLegacy'),
            },
        })
    }

    function handleClosePopup() {
        if (!isLedgerConnected) {
            closePopup()
            handleBackClick()
        }
    }

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
            <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.confirm')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
