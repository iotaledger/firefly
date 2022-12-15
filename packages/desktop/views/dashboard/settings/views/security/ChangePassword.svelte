<script lang="typescript">
    import { Button, Checkbox, PasswordInput, Spinner, Text, ButtonSize, HTMLButtonType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { MAX_STRONGHOLD_PASSWORD_LENGTH } from '@core/profile'
    import { changePasswordAndUnlockStronghold } from '@core/profile-manager'
    import zxcvbn from 'zxcvbn'
    import { exportStronghold } from '@contexts/settings'
    import { PASSWORD_REASON_MAP } from '@core/stronghold'

    let exportStrongholdChecked: boolean
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
                if (exportStrongholdChecked) {
                    changeMessageLocale = 'general.exportingStronghold'
                    void exportStronghold(newPassword, cancelStrongholdExport)
                    return
                }
                resetPasswordsOnSuccess()
            } catch (err) {
                console.error(err)
                currentPasswordError = 'error.password.incorrect'
                hideBusy(currentPasswordError, 0)
            }
        }
    }

    function cancelStrongholdExport(cancelled: boolean, err: string): void {
        if (cancelled) {
            hideBusy('', 0)
            return
        }

        if (err) {
            currentPasswordError = err
            hideBusy('general.passwordFailed', 0)
            return
        }

        resetPasswordsOnSuccess()
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
        exportStrongholdChecked = false
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

<form id="form-change-password" on:submit|preventDefault={changePassword}>
    <Text type="h4" classes="mb-3">{localize('views.settings.changePassword.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.changePassword.description')}</Text>
    <PasswordInput
        error={localize(currentPasswordError)}
        classes="mb-5"
        bind:value={currentPassword}
        showRevealToggle
        placeholder={localize('general.currentPassword')}
        disabled={busy}
        submitHandler={isPasswordValid}
    />
    <PasswordInput
        error={newPasswordError}
        classes="mb-4"
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
        classes="mb-5"
        bind:value={confirmedPassword}
        showRevealToggle
        placeholder={localize('general.confirmNewPassword')}
        disabled={busy}
        submitHandler={isPasswordValid}
    />
    <Checkbox
        classes="mb-5"
        label={localize('actions.exportNewStronghold')}
        bind:checked={exportStrongholdChecked}
        disabled={busy}
    />
    <div class="flex flex-row items-center">
        <Button
            size={ButtonSize.Medium}
            disabled={!currentPassword || !newPassword || !confirmedPassword || busy}
            onClick={changePassword}
            type={HTMLButtonType.Submit}
        >
            {localize('views.settings.changePassword.title')}
        </Button>
        <Spinner {busy} message={localize(changeMessageLocale)} classes="ml-2" />
    </div>
</form>
