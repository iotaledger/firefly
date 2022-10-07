<script lang="typescript">
    import { Animation, Button, OnboardingLayout, PinInput, Text, HTMLButtonType } from 'shared/components'
    import { onMount } from 'svelte'
    import {
        initialiseFirstShimmerClaimingAccount,
        initialisePincodeManager,
        isOnboardingLedgerProfile,
        onboardingProfile,
        ProfileSetupType,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { pollLedgerNanoStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
    import { ProfileType } from '@core/profile'
    import { storageProtectionSetupRouter } from '@core/router'
    import { validatePinFormat } from '@lib/utils'

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
        if ($isOnboardingLedgerProfile) {
            /**
             * CAUTION: We must make sure to stop polling if the user
             * goes back as we've started it when this view is mounted.
             */
            stopPollingLedgerNanoStatus()
        }
        $storageProtectionSetupRouter.previous()
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

    async function handleSetPin(): Promise<void> {
        busy = true

        await initialisePincodeManager(setPinInput)

        const canInitialiseFirstShimmerClaimingAccount =
            $onboardingProfile?.type === ProfileType.Software &&
            $onboardingProfile?.setupType === ProfileSetupType.Claimed
        const shouldInitialiseFirstShimmerClaimingAccount = $onboardingProfile?.shimmerClaimingAccounts?.length < 1
        if (canInitialiseFirstShimmerClaimingAccount && shouldInitialiseFirstShimmerClaimingAccount) {
            await initialiseFirstShimmerClaimingAccount()
        }

        busy = false

        $storageProtectionSetupRouter.next()
    }

    onMount(() => {
        /**
         * NOTE: We begin Ledger Nano status polling
         * here because it's the closest common view between
         * all Ledger flows that comes before the status
         * check page, improving the UX as the status will
         * already have been set by that point rather than setting
         * it on mount.
         */
        if ($isOnboardingLedgerProfile) {
            pollLedgerNanoStatus()
        }
    })
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
        <form id="setup-pin" class="flex flex-col" on:submit={onSetPinClick}>
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-pink dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="pin-desktop" />
    </div>
</OnboardingLayout>
