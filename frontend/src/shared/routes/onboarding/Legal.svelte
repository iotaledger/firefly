<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Box, Text, Button, Scroller, Checkbox } from '@shared-components'
    export let locale
    export let mobile

    let checkboxChecked = false
    let scrollerProgress = 0
    let legalRead = false

    $: if (scrollerProgress === 100 || checkboxChecked) {
        legalRead = true
    }

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
            <Text type="h1" classes="mb-5">{locale('views.legal.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.legal.body')}</Text>
            <Button icon="parchment" classes="w-full mb-5" secondary active onClick={() => console.log('foo')}>
                {locale('views.legal.privacy_policy.title')}
            </Button>
            <Button icon="doc" classes="w-full mb-8" secondary active onClick={() => console.log('foo')}>
                {locale('views.legal.terms_of_service.title')}
            </Button>
            <Checkbox label={locale('views.legal.checkbox')} bind:checked={checkboxChecked} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!legalRead} onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full">
            <Scroller classes="w-full" bind:progress={scrollerProgress}>
                <Box width="540px" classes="block max-w-full mx-auto py-12">
                    <Box classes="mb-12">
                        <Text type="h1" classes="mb-5">{locale('views.legal.privacy_policy.title')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_1')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_2')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_3')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_4')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_5')}</Text>
                        <Text type="p" secondary classes="mb-10">{locale('views.legal.privacy_policy.body_6')}</Text>
                    </Box>
                    <Box>
                        <Text type="h1" classes="mb-5">{locale('views.legal.terms_of_service.title')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_1')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_2')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_3')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_4')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_5')}</Text>
                        <Text type="p" secondary classes="mb-10">{locale('views.legal.terms_of_service.body_6')}</Text>
                    </Box>
                </Box>
            </Scroller>
        </div>
    </OnboardingLayout>
{/if}
