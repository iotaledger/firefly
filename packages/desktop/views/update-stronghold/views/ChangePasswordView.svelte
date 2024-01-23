<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { OnboardingLayout } from '@components'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH, changePasswordAndUnlockStronghold, unlockStronghold } from '@core/profile'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import { Animation, Button, PasswordInput, Text, TextHint } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'
    import zxcvbn from 'zxcvbn'
    import { updateStrongholdRouter } from '../update-stronghold-router'
    import { TextHintVariant } from 'shared/components/enums'
    import { AnimationEnum } from '@auxiliary/animation'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    export let oldPassword: string
    export let newPassword: string

    let passwordError: string = ''
    let confirmPassword: string = ''
    let confirmPasswordError: string = ''
    let isSubmitBusy: boolean = false
    let isSkipBusy: boolean = false

    $: passwordStrength = zxcvbn(newPassword)
    $: isBusy = isSubmitBusy || isSkipBusy

    function validatePassword(): boolean {
        isSubmitBusy = false

        if (!newPassword || newPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
            passwordError = localize('error.password.length', {
                values: {
                    length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                },
            })
            return false
        } else if (newPassword !== confirmPassword) {
            passwordError = localize('error.password.doNotMatch')
            return false
        } else if (passwordStrength.score !== 4) {
            let errorLocale = 'error.password.tooWeak'
            if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
            }
            passwordError = localize(errorLocale)
            return false
        } else if (newPassword === oldPassword) {
            passwordError = localize('error.password.sameAsOld')
            return false
        } else {
            return true
        }
    }

    async function onSubmit(): Promise<void> {
        const isPasswordValid = validatePassword()

        if (isPasswordValid) {
            try {
                isSubmitBusy = true
                await changePasswordAndUnlockStronghold(oldPassword, newPassword)
                if ($onboardingProfile) {
                    updateOnboardingProfile({ strongholdPassword: newPassword })
                }
                showAppNotification({
                    alert: true,
                    type: 'success',
                    message: localize('general.passwordSuccess'),
                })
                $updateStrongholdRouter.next()
            } catch (err) {
                console.error(err)
                passwordError = localize('error.password.incorrect')
            } finally {
                isSubmitBusy = false
            }
        }
    }

    async function onSkipClick(): Promise<void> {
        try {
            isSkipBusy = true
            newPassword = ''
            confirmPassword = ''
            await unlockStronghold(oldPassword)
            $updateStrongholdRouter.next()
        } catch (err) {
            handleError(err)
        } finally {
            isSkipBusy = false
        }
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type={TextType.h2}>
            {localize('views.settings.changePassword.title')}
        </Text>
    </div>
    <div slot="leftpane__content">
        <TextHint variant={TextHintVariant.Warning} text={localize('views.updateStronghold.changePassword.hint')} />
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form" class="mt-12">
            <PasswordInput
                bind:error={passwordError}
                bind:value={newPassword}
                classes="mb-5"
                showRevealToggle
                strengthLevels={4}
                showStrengthLevel
                strength={passwordStrength.score}
                placeholder={localize('general.password')}
                disabled={isBusy}
                submitHandler={validatePassword}
            />
            <PasswordInput
                bind:error={confirmPasswordError}
                bind:value={confirmPassword}
                classes="mb-4"
                showRevealToggle
                placeholder={localize('general.confirmPassword')}
                disabled={isBusy}
                submitHandler={validatePassword}
            />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-col gap-4">
        <Button
            type={HTMLButtonType.Button}
            outline
            classes="w-full"
            onClick={onSkipClick}
            disabled={isBusy}
            isBusy={isSkipBusy}
        >
            {localize('actions.skipAndKeep')}
        </Button>
        <Button
            form="update-stronghold-form"
            type={HTMLButtonType.Submit}
            classes="w-full"
            disabled={!newPassword || !confirmPassword || isBusy}
            isBusy={isSubmitBusy}
        >
            {localize('views.settings.changePassword.title')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation={AnimationEnum.PasswordDesktop} />
    </div>
</OnboardingLayout>
