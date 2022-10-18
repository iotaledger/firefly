<script lang="typescript">
    import { Button, Checkbox, Text, Link } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import {
        lastAcceptedTermsOfService,
        lastAcceptedPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
        needsToAcceptLatestPrivacyPolicy,
        TERMS_OF_SERVICE_VERSION,
        PRIVACY_POLICY_VERSION,
    } from '@core/app'
    import { Platform } from 'shared/lib/platform'

    const TOS_LINK = 'https://firefly.iota.org/terms'
    const PRIVACY_POLICY_LINK = 'https://firefly.iota.org/privacy'

    let checked = false
    const tos = needsToAcceptLatestTermsOfService()
    const privacyPolicy = needsToAcceptLatestPrivacyPolicy()

    function handleViewTosClick(): void {
        Platform.openUrl(TOS_LINK)
    }

    function handleViewPrivPolicyClick(): void {
        Platform.openUrl(PRIVACY_POLICY_LINK)
    }

    function handleConfirmClick(): void {
        if (tos) {
            lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        }
        if (privacyPolicy) {
            lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        }

        closePopup(true)
    }

    function getTitleText(): string {
        if (tos && privacyPolicy) {
            return 'views.legal.title'
        } else if (tos) {
            return 'popups.legalUpdate.tosTitle'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyTitle'
        }
    }

    function getBodyText(): string {
        if (tos && privacyPolicy) {
            return 'popups.legalUpdate.tosAndPrivPolicyBody'
        } else if (tos) {
            return 'popups.legalUpdate.tosBody'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyBody'
        }
    }

    function getCheckboxText(): string {
        if (tos && privacyPolicy) {
            return 'popups.legalUpdate.tosAndPrivPolicyCheckbox'
        } else if (tos) {
            return 'popups.legalUpdate.tosCheckbox'
        } else if (privacyPolicy) {
            return 'popups.legalUpdate.privPolicyCheckbox'
        }
    }
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">{localize(getTitleText())}</Text>
    <Text type="p" secondary>{localize(getBodyText())}</Text>
    {#if tos && privacyPolicy}
        <ul>
            <li><Link onClick={handleViewTosClick}>{localize('popups.legalUpdate.tosTitle')}</Link></li>
            <li><Link onClick={handleViewPrivPolicyClick}>{localize('popups.legalUpdate.privPolicyTitle')}</Link></li>
        </ul>
    {:else if tos}
        <ul>
            <li><Link onClick={handleViewTosClick}>{localize('popups.legalUpdate.tosTitle')}</Link></li>
        </ul>
    {:else if privacyPolicy}
        <ul>
            <li><Link onClick={handleViewPrivPolicyClick}>{localize('popups.legalUpdate.privPolicyTitle')}</Link></li>
        </ul>
    {/if}
    <Checkbox label={localize(getCheckboxText())} bind:checked classes="mt-4" />
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button classes="w-full" onClick={handleConfirmClick} disabled={!checked}>{localize('actions.confirm')}</Button>
</div>

<style type="text/scss">
    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;
    }
</style>
