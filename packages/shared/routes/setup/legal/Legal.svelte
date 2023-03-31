<script lang="typescript">
    import { Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Locale } from '@core/i18n'
    import Content from './Content.svelte'
    import { lastAcceptedTos, lastAcceptedPrivacyPolicy } from 'shared/lib/appSettings'
    import { TOS_VERSION, PRIVACY_POLICY_VERSION } from 'shared/lib/app'
    import { appRouter } from '@core/router'

    export let locale: Locale

    let checked = false
    let termsAccepted = false

    $: termsAccepted = checked

    function handleContinueClick(): void {
        lastAcceptedTos.set(TOS_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        $appRouter.next()
    }
    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.legal.title')}</Text>
    </div>
    <div slot="leftpane__content">
        {#if !$mobile}
            <Text type="p" secondary classes="mb-8">{locale('views.legal.body')}</Text>
        {/if}
    </div>
    <div slot="leftpane__action" class="flex flex-col {$mobile ? 'space-y-4' : 'space-y-8'}">
        {#if !$mobile}
            <Checkbox label={locale('views.legal.checkbox')} bind:checked />
            <Button classes="w-full" disabled={!termsAccepted} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class={!$mobile && 'w-full h-full flex items-center px-40 py-20'}>
        <div
            class="legal-content {!$mobile
                ? 'block relative max-h-full overflow-y-auto w-full text-justify pr-10'
                : 'px-6'}"
        >
            <Content />
        </div>
    </div>
</OnboardingLayout>

<style type="text/scss">
    .legal-content {
        :global(ul) {
            display: block;
            list-style-type: disc;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 20px;
        }
    }
</style>
