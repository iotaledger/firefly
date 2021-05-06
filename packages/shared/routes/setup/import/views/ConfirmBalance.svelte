<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile
    export let balance

    const dispatch = createEventDispatcher()

    function sync() {}

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
            <Text type="h2" classes="mb-5">{locale('views.balance.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.balance.body')}</Text>
            <balance class="flex-grow mt-24">
                <div class="flex mb-2">
                    <Text type="h2" classes="uppercase">{balance}</Text>
                    <Text type="h4" secondary classes="ml-1">i</Text>
                </div>
                <Text type="p" highlighted classes="mb-3 uppercase">{balance} USD</Text>
            </balance>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button secondary onClick={sync}>{locale('actions.checkAgain')}</Button>
            <Button onClick={handleContinueClick}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="balance-desktop" />
        </div>
    </OnboardingLayout>
{/if}
