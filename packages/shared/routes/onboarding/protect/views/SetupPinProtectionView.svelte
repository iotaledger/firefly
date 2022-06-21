<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, OnboardingLayout, PinInput, Text } from 'shared/components'
    import { cleanupProtectionOnboarding, resetImportState } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { validatePinFormat } from '@lib/utils'

    export let busy = false

    let setPinInput = ''
    let setPinInputError = ''
    let confirmPinInput = ''
    let confirmPinInputError = ''

    $: setPinInput, (setPinInputError = '')
    $: confirmPinInput, (confirmPinInputError = '')

    let arePinInputsMatching = false
    $: arePinInputsMatching = setPinInput === confirmPinInput
    let arePinInputsValid = false
    $: arePinInputsValid = validatePinFormat(setPinInput) && validatePinFormat(confirmPinInput)
    $: if (arePinInputsValid && !arePinInputsMatching) {
        confirmPinInputError = localize('error.pincode.match')
    } else {
        confirmPinInputError = ''
    }

    const dispatch = createEventDispatcher()

    async function handleBackClick(): Promise<void> {
        await resetImportState()
        dispatch('previous')
    }

    async function handleSetPinClick(): Promise<void> {
        resetPinInputErrors()
        if (arePinInputsValid && arePinInputsMatching) {
            await advanceView()
        }
    }

    function resetPinInputErrors(): void {
        setPinInputError = ''
        confirmPinInputError = ''
    }

    async function advanceView(): Promise<void> {
        await cleanupProtectionOnboarding(setPinInput)
        dispatch('next')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.setupPin.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <div class="flex flex-col mb-8">
            <Text type="p" secondary classes="mb-4">{localize('views.setupPin.body1')}</Text>
            <Text type="p" secondary highlighted>{localize('views.setupPin.body2')}</Text>
        </div>
        <div class="flex flex-col">
            <PinInput
                bind:value={setPinInput}
                glimpse
                classes="w-full mx-auto block mb-4"
                autofocus
                disabled={busy}
                error={setPinInputError}
                label={localize('actions.setPin')}
            />
            <PinInput
                bind:value={confirmPinInput}
                glimpse
                classes="w-full mx-auto block"
                disabled={busy}
                error={confirmPinInputError}
                label={localize('actions.confirmPin')}
            />
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            disabled={!(arePinInputsValid && arePinInputsMatching) || busy}
            onClick={handleSetPinClick}
        >
            {localize('actions.setPinCode')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-pink dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="pin-desktop" />
    </div>
</OnboardingLayout>
