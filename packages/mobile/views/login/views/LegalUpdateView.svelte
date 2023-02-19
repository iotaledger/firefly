<script lang="ts">
    import { Button, Checkbox, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        lastAcceptedTermsOfService,
        lastAcceptedPrivacyPolicy,
        TERMS_OF_SERVICE_VERSION,
        PRIVACY_POLICY_VERSION,
    } from '@core/app'
    import { ConditionOfUse } from '../../../components'

    export let onAccept: () => unknown = () => {}

    let checked = false

    const title = `${localize('popups.legalUpdate.tosTitle')} & ${localize('popups.legalUpdate.privPolicyTitle')}`
    const bodyText = localize('popups.legalUpdate.tosAndPrivPolicyBody')
    const checkboxText = localize('popups.legalUpdate.tosAndPrivPolicyCheckbox')

    function handleConfirmClick(): void {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        onAccept()
    }
</script>

<div class="relative h-full p-5 flex flex-col justify-between">
    <header class="relative w-full flex justify-center px-6 mb-6">
        <Text type={TextType.h4} classes="text-center">{title}</Text>
    </header>
    <div class="flex flex-col h-full overflow-y-auto">
        <Text type={TextType.p} secondary>{bodyText}</Text>
        <div class="mt-4">
            <ConditionOfUse />
        </div>
    </div>
    <div class="space-y-8 mt-6">
        <div class="flex flex-row items-center mb-4">
            <Checkbox label={checkboxText} bind:checked />
        </div>
        <Button classes="w-full" onClick={handleConfirmClick} disabled={!checked}>{localize('actions.confirm')}</Button>
    </div>
</div>
