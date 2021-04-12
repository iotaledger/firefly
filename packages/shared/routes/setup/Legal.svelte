<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Text, Button, Scroller, Checkbox } from 'shared/components'
    export let locale
    export let mobile

    let checked = false
    let progress = 0
    let termsAccepted = false

    let scroller
    let index

    let privacyPolicy
    let termsOfService

    $: termsAccepted = checked

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<style type="text/scss">
    [slot='rightpane'] section {
        scroll-margin: 3rem;
    }

    :global(.legal-scroll-bar) {
            &::-webkit-scrollbar-thumb {
                @apply border-gray-100;
            }
        }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.legal.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.legal.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Checkbox label={locale('views.legal.checkbox')} bind:checked classes="mb-8" />
            <Button classes="w-full" disabled={!termsAccepted} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center px-40 py-20">
            <Scroller classes="w-full text-justify py-12 pr-10 legal-scroll-bar" threshold={70} bind:progress bind:index bind:this={scroller}>
                <section class="mb-12" bind:this={privacyPolicy}>
                    <Text type="h1" classes="mb-5">{locale('views.legal.privacyPolicy.title')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.privacyPolicy.body1')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.privacyPolicy.body2')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.privacyPolicy.body3')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.privacyPolicy.body4')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.privacyPolicy.body5')}</Text>
                    <Text type="p" secondary classes="mb-10">{locale('views.legal.privacyPolicy.body6')}</Text>
                </section>
                <section bind:this={termsOfService}>
                    <Text type="h1" classes="mb-5">{locale('views.legal.termsOfService.title')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.termsOfService.body1')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.termsOfService.body2')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.termsOfService.body3')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.termsOfService.body4')}</Text>
                    <Text type="p" secondary classes="mb-5">{locale('views.legal.termsOfService.body5')}</Text>
                    <Text type="p" secondary classes="mb-10">{locale('views.legal.termsOfService.body6')}</Text>
                </section>
            </Scroller>
        </div>
    </OnboardingLayout>
{/if}
