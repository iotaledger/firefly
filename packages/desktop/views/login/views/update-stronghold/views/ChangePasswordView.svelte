<script lang="ts">
    import zxcvbn from 'zxcvbn'

    import { OnboardingLayout } from '@components'
    import { Animation, Button, PasswordInput, Text, TextHint } from '@ui'
    import { ButtonSize, HTMLButtonType, TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changePasswordAndUnlockStronghold } from '@core/profile-manager'
    import { updateStrongholdRouter } from '@core/router/subrouters/login'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'

    export let actualPassword: string

    let startOfPasswordChange: number

    let password: string = ''
    let passwordError: string = ''
    let confirmPassword: string = ''
    let confirmPasswordError: string = ''

    let busy: boolean = false
    let submitButtonText: string = ''

    $: passwordStrength = zxcvbn(password)

    async function onSubmit(): Promise<void> {
        if (isPasswordValid()) {
            busy = true
            submitButtonText = localize('general.passwordUpdating')
            startOfPasswordChange = Date.now()

            try {
                await changePasswordAndUnlockStronghold(actualPassword, password)
                resetPasswordsOnSuccess()
            } catch (err) {
                console.error(err)
                passwordError = localize('error.password.incorrect')
                hideBusy(passwordError, 0)
            }
        }
    }

    function isPasswordValid(): boolean {
        if (password && confirmPassword) {
            resetErrors()

            if (password.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
                passwordError = localize('error.password.length', {
                    values: {
                        length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                    },
                })
                return false
            } else if (password !== confirmPassword) {
                passwordError = localize('error.password.doNotMatch')
                return false
            } else if (passwordStrength.score !== 4) {
                let errorLocale = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                    errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
                }
                passwordError = localize(errorLocale)
                return false
            }

            return true
        }
        return false
    }

    function resetErrors(): void {
        passwordError = ''
        confirmPasswordError = ''
        busy = false
        submitButtonText = ''
    }

    function resetPasswordsOnSuccess(): void {
        password = ''
        confirmPassword = ''
        hideBusy('general.passwordSuccess', 2000)
    }

    function hideBusy(messageLocale: string, timeout: number): void {
        const diff = Date.now() - startOfPasswordChange
        if (diff < timeout) {
            setTimeout(() => {
                showPasswordMessage(messageLocale)
            }, timeout - diff)
        } else {
            showPasswordMessage(messageLocale)
        }
    }

    function showPasswordMessage(message: string): void {
        busy = false
        submitButtonText = message
        setTimeout(() => (submitButtonText = ''), 2000)
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
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
                classes="mb-5"
                bind:value={password}
                showRevealToggle
                strengthLevels={4}
                showStrengthLevel
                strength={passwordStrength.score}
                placeholder={localize('general.password')}
                disabled={busy}
                submitHandler={isPasswordValid}
            />
            <PasswordInput
                bind:error={confirmPasswordError}
                classes="mb-4"
                bind:value={confirmPassword}
                showRevealToggle
                placeholder={localize('general.confirmPassword')}
                disabled={busy}
                submitHandler={isPasswordValid}
            />
        </form>
    </div>
    <div slot="leftpane__action">
        <Button outline type={HTMLButtonType.Button} form="update-stronghold-form" classes="w-full">
            {localize('actions.skip')}
        </Button>
        <Button
            size={ButtonSize.Medium}
            disabled={!password || !confirmPassword || busy}
            isBusy={busy}
            type={HTMLButtonType.Submit}
        >
            {submitButtonText}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="password-desktop" />
    </div>
</OnboardingLayout>
