<script lang="typescript">
    import { Animation, Button, OnboardingLayout, PinInput, Text } from 'shared/components'
    import {
        initialiseFirstShimmerClaimingAccount,
        initialisePincodeManager,
        onboardingProfile,
        ProfileSetupType,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { storageProtectionSetupRouter } from '@core/router'
    import { validatePinFormat } from '@lib/utils'
    import { HTMLButtonType } from 'shared/components/Button.svelte'

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
    $: arePinInputsValid = validatePinFormat(setPinInput) && validatePinFormat(confirmPinInput)
    $: if (arePinInputsValid && !arePinInputsMatching) {
        confirmPinInputError = localize('error.pincode.match')
    } else {
        confirmPinInputError = ''
    }

    function onBackClick(): void {
        $storageProtectionSetupRouter.previous()
    }

    async function onSetPinClick(): Promise<void> {
        await initialisePincodeManager(setPinInput)

        const canInitialiseFirstShimmerClaimingAccount =
            $onboardingProfile?.type === ProfileType.Software &&
            $onboardingProfile?.setupType === ProfileSetupType.Claimed
        const shouldInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.shimmerClaimingAccounts?.length < 1
        if (canInitialiseFirstShimmerClaimingAccount && shouldInitialiseFirstShimmerClaimingAccount) {
            await initialiseFirstShimmerClaimingAccount()
        }

        $storageProtectionSetupRouter.next()
    }

    async function handleSetPinSubmit(): Promise<void> {
        resetPinInputErrors()
        if (arePinInputsValid && arePinInputsMatching) {
            await onSetPinClick()
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
        <form id="setup-pin" class="flex flex-col" on:submit={handleSetPinSubmit}>
            <PinInput
                bind:value={setPinInput}
                glimpse
                classes="w-full mx-auto block mb-4"
                autofocus
                disabled={busy}
                error={setPinInputError}
                label={localize('actions.setPin')}
                on:filled={confirmPinInputElement.focus}
                on:submit={handleSetPinSubmit}
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
                on:submit={handleSetPinSubmit}
            />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            type={HTMLButtonType.Submit}
            disabled={!(arePinInputsValid && arePinInputsMatching) || busy}
            form="setup-pin"
            bind:this={submitButtonElement}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-pink dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="pin-desktop" />
    </div>
</OnboardingLayout>
