<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { initialisePincodeManager } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { isValidPin } from '@core/utils'
    import { Animation, Button, HTMLButtonType, PinInput, Text } from '@ui'
    import { completeOnboardingRouter } from '../complete-onboarding-router'
    import { AnimationEnum } from '@auxiliary/animation'

    export let busy = false

    let setPinInput = ''
    let setPinInputError = ''
    let confirmPinInput = ''
    let confirmPinInputError = ''
    let arePinInputsMatching = false
    let arePinInputsValid = false
    let confirmPinInputElement: PinInput
    let submitButtonElement: Button

    $: setPinInput, (setPinInputError = '')
    $: confirmPinInput, (confirmPinInputError = '')
    $: arePinInputsMatching = setPinInput === confirmPinInput
    $: arePinInputsValid = isValidPin(setPinInput) && isValidPin(confirmPinInput)
    $: if (arePinInputsValid && !arePinInputsMatching) {
        confirmPinInputError = localize('error.pincode.match')
    } else {
        confirmPinInputError = ''
    }

    async function handleSetPin(): Promise<void> {
        busy = true
        await initialisePincodeManager(setPinInput)
        busy = false

        $completeOnboardingRouter.next()
    }

    function onBackClick(): void {
        $completeOnboardingRouter.previous()
    }

    async function onSetPinClick(): Promise<void> {
        resetPinInputErrors()
        if (arePinInputsValid && arePinInputsMatching) {
            await handleSetPin()
        }
    }

    function resetPinInputErrors(): void {
        setPinInputError = ''
        confirmPinInputError = ''
    }
</script>

<OnboardingLayout {onBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.storageProtectionSetup.setupPinProtection.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <div class="flex flex-col mb-8">
            <Text type="p" secondary classes="mb-4"
                >{localize('views.onboarding.storageProtectionSetup.setupPinProtection.body1')}</Text
            >
            <Text type="p" secondary highlighted
                >{localize('views.onboarding.storageProtectionSetup.setupPinProtection.body2')}</Text
            >
        </div>
        <form id="setup-pin" class="flex flex-col" on:submit|preventDefault={onSetPinClick}>
            <PinInput
                bind:value={setPinInput}
                glimpse
                classes="w-full mx-auto block mb-4"
                autofocus
                disabled={busy}
                error={setPinInputError}
                label={localize('actions.setPin')}
                on:filled={confirmPinInputElement.focus}
                on:submit={onSetPinClick}
            />
            <PinInput
                bind:value={confirmPinInput}
                glimpse
                classes="w-full mx-auto block"
                disabled={busy}
                error={confirmPinInputError}
                label={localize('actions.confirmPin')}
                bind:this={confirmPinInputElement}
                on:filled={submitButtonElement.resetAndFocus}
                on:submit={onSetPinClick}
            />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            type={HTMLButtonType.Submit}
            disabled={!(arePinInputsValid && arePinInputsMatching) || busy}
            form="setup-pin"
            isBusy={busy}
            busyMessage={`${localize('actions.initializing')}...`}
            bind:this={submitButtonElement}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-pink dark:bg-gray-900">
        <Animation animation={AnimationEnum.PinDesktop} />
    </div>
</OnboardingLayout>
