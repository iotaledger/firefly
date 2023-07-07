<script lang="ts">
    import { Button, Checkbox, Link, Text, TextType } from '@ui'

    import {
        lastAcceptedPrivacyPolicy,
        lastAcceptedTermsOfService,
        needsToAcceptLatestPrivacyPolicy,
        needsToAcceptLatestTermsOfService,
        openUrlInBrowser,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_VERSION,
        TERMS_OF_SERVICE_URL,
        PRIVACY_POLICY_URL,
    } from '@core/app'
    import { localize } from '@core/i18n'

    import { closeDrawer, DrawerId, updateDrawerProps } from '@/auxiliary/drawer'

    const needsToAcceptTermsOfService = needsToAcceptLatestTermsOfService()
    const needsToAcceptPrivacyPolicy = needsToAcceptLatestPrivacyPolicy()

    const title = getTitleText()
    const bodyText = getBodyText()
    const checkboxText = getCheckboxText()

    updateDrawerProps(DrawerId.LegalUpdate, { title })

    let checked = false

    function handleViewTosClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function handleViewPrivPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    function onConfirmClick(): void {
        if (needsToAcceptTermsOfService) {
            lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        }
        if (needsToAcceptPrivacyPolicy) {
            lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        }
        closeDrawer(DrawerId.LegalUpdate)
    }

    function getTitleText(): string {
        if (needsToAcceptTermsOfService && needsToAcceptPrivacyPolicy) {
            return localize('views.onboarding.appSetup.legal.title')
        } else if (needsToAcceptTermsOfService) {
            return localize('popups.legalUpdate.tosTitle')
        } else if (needsToAcceptPrivacyPolicy) {
            return localize('popups.legalUpdate.privPolicyTitle')
        }
    }

    function getBodyText(): string {
        if (needsToAcceptTermsOfService && needsToAcceptPrivacyPolicy) {
            return localize('popups.legalUpdate.tosAndPrivPolicyBody')
        } else if (needsToAcceptTermsOfService) {
            return localize('popups.legalUpdate.tosBody')
        } else if (needsToAcceptPrivacyPolicy) {
            return localize('popups.legalUpdate.privPolicyBody')
        }
    }

    function getCheckboxText(): string {
        if (needsToAcceptTermsOfService && needsToAcceptPrivacyPolicy) {
            return localize('popups.legalUpdate.tosAndPrivPolicyCheckbox')
        } else if (needsToAcceptTermsOfService) {
            return localize('popups.legalUpdate.tosCheckbox')
        } else if (needsToAcceptPrivacyPolicy) {
            return localize('popups.legalUpdate.privPolicyCheckbox')
        }
    }
</script>

<legal-update-drawer class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p} secondary>{bodyText}</Text>
        {#if needsToAcceptTermsOfService && needsToAcceptPrivacyPolicy}
            <ul>
                <li><Link onClick={handleViewTosClick}>{localize('popups.legalUpdate.tosTitle')}</Link></li>
                <li>
                    <Link onClick={handleViewPrivPolicyClick}>{localize('popups.legalUpdate.privPolicyTitle')}</Link>
                </li>
            </ul>
        {:else if needsToAcceptTermsOfService}
            <ul>
                <li><Link onClick={handleViewTosClick}>{localize('popups.legalUpdate.tosTitle')}</Link></li>
            </ul>
        {:else if needsToAcceptPrivacyPolicy}
            <ul>
                <li>
                    <Link onClick={handleViewPrivPolicyClick}>{localize('popups.legalUpdate.privPolicyTitle')}</Link>
                </li>
            </ul>
        {/if}
        <Checkbox label={checkboxText} bind:checked />
    </div>
    <Button classes="w-full" onClick={onConfirmClick} disabled={!checked}>{localize('actions.confirm')}</Button>
</legal-update-drawer>

<style lang="scss">
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
