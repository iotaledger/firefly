<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Text, Button, Scroller, Checkbox } from 'shared/components'
    export let locale
    export let mobile

    let checked = false
    let progress = 0
    let legalRead = false

    let scroller
    let index

    let privacyPolicy
    let termsOfService

    $: if (progress === 100 || checked) {
        legalRead = true
    }

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }

    function scrollIntoView(section) {
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }
</script>

<style type="text/scss">
    [slot='rightpane'] section {
        scroll-margin: 3rem;
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.legal.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.legal.body')}</Text>
            <Button active={index === 0} icon="parchment" classes="w-full mb-5" onClick={() => scrollIntoView(privacyPolicy)}>
                {locale('views.legal.privacy_policy.title')}
            </Button>
            <Button active={index === 1} icon="doc" classes="w-full mb-6" onClick={() => scrollIntoView(termsOfService)}>
                {locale('views.legal.terms_of_service.title')}
            </Button>
            <Checkbox label={locale('views.legal.checkbox')} bind:checked />
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={!legalRead} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full">
            <Scroller classes="w-full text-justify py-12 pr-10" threshold={70} bind:progress bind:index bind:this={scroller}>
                <div class="max-w-sm">
                    <section class="mb-12" bind:this={privacyPolicy}>
                        <Text type="h1" classes="mb-5">{locale('views.legal.privacy_policy.title')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_1')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_2')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_3')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_4')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.privacy_policy.body_5')}</Text>
                        <Text type="p" secondary classes="mb-10">{locale('views.legal.privacy_policy.body_6')}</Text>
                    </section>
                    <section bind:this={termsOfService}>
                        <Text type="h1" classes="mb-5">{locale('views.legal.terms_of_service.title')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_1')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_2')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_3')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_4')}</Text>
                        <Text type="p" secondary classes="mb-5">{locale('views.legal.terms_of_service.body_5')}</Text>
                        <Text type="p" secondary classes="mb-10">{locale('views.legal.terms_of_service.body_6')}</Text>
                    </section>
                </div>
            </Scroller>
        </div>
    </OnboardingLayout>
{/if}
