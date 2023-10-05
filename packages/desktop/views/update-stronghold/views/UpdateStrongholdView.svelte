<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { migrateStrongholdFromOnboardingProfile } from '@contexts/onboarding/actions'
    import { localize } from '@core/i18n'
    import { migrateStrongholdFromActiveProfile } from '@core/profile/actions/active-profile'
    import { isValidJson } from '@core/utils'
    import { Animation, Button, PasswordInput, Text } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'
    import { updateStrongholdRouter } from '../update-stronghold-router'
    import { AnimationEnum } from '@auxiliary/animation'
    import { Platform } from '@core/app'
    import { onboardingProfile } from '@contexts/onboarding'
    import features from '@features/features'
    import { handleError } from '@core/error/handlers'
    import { StrongholdVersion } from '@core/stronghold'

    export let password: string = ''
    export let isRecovery: boolean = false

    let parsedError = null
    let passwordError: string = ''
    let isBusy = false

    function emitStrongholdMigrationEvent(eventProperties: Record<string, unknown>): void {
        if (features.analytics.strongholdMigration.enabled) {
            Platform.trackEvent('stronghold-migration', eventProperties)
        }
    }

    async function onSubmit(): Promise<void> {
        const onboardingType = $onboardingProfile?.onboardingType

        try {
            isBusy = true
            if (isRecovery) {
                await migrateStrongholdFromOnboardingProfile(password)
                emitStrongholdMigrationEvent({ success: true, onboardingType })
            } else {
                await migrateStrongholdFromActiveProfile(password)
                emitStrongholdMigrationEvent({ success: true })
            }
            isBusy = false
            $updateStrongholdRouter.next()
        } catch (err) {
            handleError(err)
            isBusy = false
            const message = err?.message ?? ''
            parsedError = isValidJson(message) ? JSON.parse(message) : ''
            const error = parsedError?.payload?.error.replaceAll('`', '') ?? localize(message)
            if(error.includes("input unexpected")){
                $onboardingProfile.strongholdVersion = StrongholdVersion.V3;
                emitStrongholdMigrationEvent({ success: true })
                $updateStrongholdRouter.next()
                return
            } else {
                passwordError = error
            }
            emitStrongholdMigrationEvent({ success: false, onboardingType })
            return
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>
            {localize('views.updateStronghold.update.title')}
        </Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-12">
            {localize(`views.updateStronghold.update.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
        </Text>
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form">
            <PasswordInput bind:value={password} bind:error={passwordError} autofocus showRevealToggle />
        </form>
    </div>
    <div slot="leftpane__action">
        <p>{JSON.stringify(parsedError)}</p>
        <Button
            type={HTMLButtonType.Submit}
            form="update-stronghold-form"
            classes="w-full"
            disabled={isBusy || !password || !!passwordError}
            {isBusy}
        >
            {localize('actions.updateAndContinue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportFromFilePasswordDesktop} />
    </div>
</OnboardingLayout>
