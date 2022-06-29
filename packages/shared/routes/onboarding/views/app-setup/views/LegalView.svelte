<script lang="typescript">
    import { Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import ConditionsOfUse from './ConditionsOfUse.svelte'
    import {
        lastAcceptedPrivacyPolicy,
        lastAcceptedTermsOfService,
        mobile,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { appSetupRouter } from '@core/router'

    let checked = false
    let termsAccepted = false

    $: termsAccepted = checked

    function handleContinueClick(): void {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        $appSetupRouter.next()
    }

    function handleBackClick(): void {
        $appSetupRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.legal.title')}</Text>
    </div>
    <div slot="leftpane__content">
        {#if !$mobile}
            <Text type="p" secondary classes="mb-8">{localize('views.legal.body')}</Text>
        {/if}
    </div>
    <div slot="leftpane__action" class="flex flex-col {$mobile ? 'space-y-4' : 'space-y-8'}">
        <Checkbox label={localize('views.legal.checkbox')} bind:checked />
        <Button classes="w-full" disabled={!termsAccepted} onClick={handleContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class={!$mobile && 'w-full h-full flex items-center px-40 py-20'}>
        <div
            class="legal-content {!$mobile &&
                'block relative max-h-full overflow-y-auto w-full text-justify pr-10 scroll-quaternary'}"
        >
            <ConditionsOfUse />
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
