<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, ImportTextfield, Button } from '@shared-components'
    export let locale
    export let mobile

    let input

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next', { input })
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
            <Text type="h1" classes="mb-5">{locale('views.import_from_text.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.import_from_text.body_1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_from_text.body_2')}</Text>
            <Text type="h5" classes="mb-4">{locale('views.import_from_text.body_3')}</Text>
            <ImportTextfield bind:value={input} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!input || input.length < 10} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-desktop" />
        </div>
    </OnboardingLayout>
{/if}
