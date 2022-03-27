<script lang="typescript">
    import { Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher } from 'svelte'
    import Content from './Content.svelte'
    import { lastAcceptedTos, lastAcceptedPrivacyPolicy } from 'shared/lib/appSettings'
    import { TOS_VERSION, PRIVACY_POLICY_VERSION } from 'shared/lib/app'

    export let locale: Locale

    let checked = false
    let termsAccepted = false

    $: termsAccepted = checked

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        lastAcceptedTos.set(TOS_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} reverseContent>
    <div slot="title">
        <Text type="h2">{locale('views.legal.title')}</Text>
    </div>
    <div slot="leftpane__content">
        {#if !$mobile}
            <Text type="p" secondary classes="mb-8">{locale('views.legal.body')}</Text>
        {/if}
    </div>
    <div slot="leftpane__action" class="flex flex-col {$mobile ? 'space-y-4' : 'space-y-8'}">
        <Checkbox label={locale('views.legal.checkbox')} bind:checked />
        <Button classes="w-full" disabled={!termsAccepted} onClick={() => handleContinueClick()}>
            {locale('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class={!$mobile && 'w-full h-full flex items-center px-40 py-20'}>
        <div
            class="legal-content {!$mobile &&
                'block relative max-h-full overflow-y-auto w-full text-justify pr-10 scroll-quaternary'}"
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
