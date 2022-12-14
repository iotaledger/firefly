<script lang="typescript">
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changePasswordAndUnlockStronghold } from '@core/profile-manager'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'
    import { Button, ButtonSize, PasswordInput, Text, TextType } from 'shared/components'
    import zxcvbn from 'zxcvbn'

    let startOfPasswordChange: number

    let currentPassword = ''
    let currentPasswordError = ''
    let newPassword = ''
    let confirmedPassword = ''
    let busy = false
    let newPasswordError = ''
    let changeMessageLocale = ''

    $: passwordStrength = zxcvbn(newPassword)

    async function changePassword(): Promise<void> {
        if (isPasswordValid()) {
            busy = true
            changeMessageLocale = 'general.passwordUpdating'
            startOfPasswordChange = Date.now()

            try {
                await changePasswordAndUnlockStronghold(currentPassword, newPassword)
                resetPasswordsOnSuccess()
            } catch (err) {
                console.error(err)
                currentPasswordError = 'error.password.incorrect'
                hideBusy(currentPasswordError, 0)
            }
        }
    }

    function isPasswordValid(): boolean {
        if (currentPassword && newPassword && confirmedPassword) {
            resetErrors()

            if (newPassword.length > MAX_STRONGHOLD_PASSWORD_LENGTH) {
                newPasswordError = localize('error.password.length', {
                    values: {
                        length: MAX_STRONGHOLD_PASSWORD_LENGTH,
                    },
                })
                return false
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = localize('error.password.doNotMatch')
                return false
            } else if (passwordStrength.score !== 4) {
                let errorLocale = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && PASSWORD_REASON_MAP[passwordStrength.feedback.warning]) {
                    errorLocale = `error.password.${PASSWORD_REASON_MAP[passwordStrength.feedback.warning]}`
                }
                newPasswordError = localize(errorLocale)
                return false
            }

            return true
        }
        return false
    }

    function resetErrors(): void {
        currentPasswordError = ''
        newPasswordError = ''
        busy = false
        changeMessageLocale = ''
    }

    function resetPasswordsOnSuccess(): void {
        currentPassword = ''
        newPassword = ''
        confirmedPassword = ''
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
        changeMessageLocale = message
        setTimeout(() => (changeMessageLocale = ''), 2000)
    }
</script>

<div class="flex flex-col justify-between h-full">
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p} secondary classes="mb-1">{localize('views.settings.changePassword.description')}</Text>
        <PasswordInput
            error={localize(currentPasswordError)}
            classes="mb-1"
            bind:value={currentPassword}
            showRevealToggle
            placeholder={localize('general.currentPassword')}
            disabled={busy}
            submitHandler={isPasswordValid}
        />
        <PasswordInput
            error={newPasswordError}
            bind:value={newPassword}
            showRevealToggle
            strengthLevels={4}
            showStrengthLevel
            strength={passwordStrength.score}
            placeholder={localize('general.newPassword')}
            disabled={busy}
            submitHandler={isPasswordValid}
        />
        <PasswordInput
            bind:value={confirmedPassword}
            showRevealToggle
            placeholder={localize('general.confirmNewPassword')}
            disabled={busy}
            submitHandler={isPasswordValid}
        />
    </div>
    <Button
        size={ButtonSize.Medium}
        disabled={!currentPassword || !newPassword || !confirmedPassword || busy}
        onClick={changePassword}
    >
        {localize('views.settings.changePassword.title')}
    </Button>
</div>
