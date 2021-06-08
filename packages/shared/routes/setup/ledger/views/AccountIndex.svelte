<script lang="typescript">
    import { Button, OnboardingLayout, Text, Spinner, Icon, Number } from 'shared/components'
    import { createEventDispatcher, onDestroy } from 'svelte'

    export let locale
    export let mobile

    let index = 0

    const dispatch = createEventDispatcher()

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
            <Text type="h2" classes="mb-5">{locale('views.selectLedgerAccountIndex.title')}</Text>
            <Text type="p" secondary>{locale('views.selectLedgerAccountIndex.body')}</Text>
            <Number bind:value={index} autofocus classes="mt-8" />
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.confirm')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
