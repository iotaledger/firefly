<script lang="ts">
    import { Button, Checkbox, Text, TextType } from 'shared/components'
    import { ConditionOfUse } from '../../../components'
    import {
        lastAcceptedPrivacyPolicy,
        lastAcceptedTermsOfService,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app'
    import { localize } from '@core/i18n'

    export let onAccept: () => unknown = () => {}

    let checked = false

    function handleConfirmClick(): void {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        onAccept()
    }
</script>

<legal-update-view class="relative h-full p-5 flex flex-col justify-between">
    <legal-update-header class="relative w-full flex justify-center px-6 mb-6">
        <Text type={TextType.h4} classes="text-center">{localize('views.onboarding.appSetup.legal.title')}</Text>
    </legal-update-header>
    <legal-update-body class="flex flex-col h-full overflow-y-auto">
        <Text type={TextType.p} secondary>{localize('popups.legalUpdate.tosAndPrivPolicyBody')}</Text>
        <div class="mt-4">
            <ConditionOfUse />
        </div>
    </legal-update-body>
    <legal-update-actions class="space-y-8 mt-6">
        <div class="flex flex-row items-center mb-4">
            <Checkbox label={localize('popups.legalUpdate.tosAndPrivPolicyCheckbox')} bind:checked />
        </div>
        <Button classes="w-full" onClick={handleConfirmClick} disabled={!checked}>{localize('actions.confirm')}</Button>
    </legal-update-actions>
</legal-update-view>
