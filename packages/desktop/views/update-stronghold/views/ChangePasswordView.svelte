<script lang="ts">
    import zxcvbn from 'zxcvbn'

    import { OnboardingLayout } from '@components'
    import { Animation, Button, PasswordInput, Text, TextHint } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changeStrongholdPassword } from '@core/profile-manager'
    import { updateStrongholdRouter } from '@core/router/subrouters'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'

    import { showAppNotification } from '@auxiliary/notification'

    export let oldPassword: string = ''
    export let newPassword: string = ''

    let passwordError: string = ''
    let confirmPassword: string = ''
    let confirmPasswordError: string = ''
    let busy: boolean = false

    $: passwordStrength = zxcvbn(newPassword)

    function validatePassword(): boolean {
        busy = false

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
                busy = true
                await changeStrongholdPassword(oldPassword, newPassword)
                showAppNotification({
                    type: 'success',
                    message: localize('general.passwordSuccess'),
                })
                $updateStrongholdRouter.next()
            } catch (err) {
                console.error(err)
                passwordError = localize('error.password.incorrect')
            } finally {
                busy = false
            }
        }
    }

    function onSkipClick(): void {
        newPassword = ''
        $updateStrongholdRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type={TextType.h2}>
            {localize('views.settings.changePassword.title')}
        </Text>
    </div>
    <div slot="leftpane__content">
        <TextHint warning text={localize('views.updateStronghold.changePassword.hint')} />
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
                disabled={busy}
                submitHandler={validatePassword}
            />
            <PasswordInput
                bind:error={confirmPasswordError}
                bind:value={confirmPassword}
                classes="mb-4"
                showRevealToggle
                placeholder={localize('general.confirmPassword')}
                disabled={busy}
                submitHandler={validatePassword}
            />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-col gap-4">
        <Button type={HTMLButtonType.Button} outline classes="w-full" onClick={onSkipClick}>
            {localize('actions.skipAndKeep')}
        </Button>
        <Button
            form="update-stronghold-form"
            disabled={!newPassword || !confirmPassword || busy}
            isBusy={busy}
            type={HTMLButtonType.Submit}
            classes="w-full"
        >
            {localize('views.settings.changePassword.title')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="password-desktop" />
    </div>
</OnboardingLayout>
