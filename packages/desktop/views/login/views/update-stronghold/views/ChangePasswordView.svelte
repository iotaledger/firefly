<script lang="ts">
    import zxcvbn from 'zxcvbn'

    import { OnboardingLayout } from '@components'
    import { Animation, Button, PasswordInput, Text, TextHint } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changePasswordAndUnlockStronghold } from '@core/profile-manager'
    import { updateStrongholdRouter } from '@core/router/subrouters/login'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'

    export let actualPassword: string

    let password: string = ''
    let passwordError: string = ''
    let confirmPassword: string = ''
    let confirmPasswordError: string = ''
    let busy: boolean = false

    $: passwordStrength = zxcvbn(password)
    $: isPasswordValid = passwordError === '' && confirmPasswordError === ''

    function validatePassword(): void {
        if (password && confirmPassword) {
            busy = false
            if (password.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
                passwordError = localize('error.password.length', {
                    values: {
                        length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                    },
                })
            } else if (password !== confirmPassword) {
                passwordError = localize('error.password.doNotMatch')
            } else if (passwordStrength.score !== 4) {
                let errorLocale = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                    errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
                }
                passwordError = localize(errorLocale)
            } else if (password === actualPassword) {
                passwordError = localize('error.password.sameAsOld')
            }
        }
    }

    async function onSubmit(): Promise<void> {
        validatePassword()
        if (isPasswordValid) {
            try {
                busy = true
                await changePasswordAndUnlockStronghold(actualPassword, password)
                $updateStrongholdRouter.next()
                busy = false
            } catch (err) {
                busy = false
                console.error(err)
                passwordError = localize('error.password.incorrect')
            }
        }
    }

    function onSkipClick(): void {
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
                bind:value={password}
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
            {localize('actions.skip')}
        </Button>
        <Button
            form="update-stronghold-form"
            disabled={!password || !confirmPassword || busy}
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
