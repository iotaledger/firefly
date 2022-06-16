<script lang="typescript">
    import { Button, Checkbox, PasswordInput, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import passwordInfo from 'shared/lib/password'
    import { MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import zxcvbn from 'zxcvbn'
    import { exportStronghold } from '@contexts/settings'
    import { get } from 'svelte/store'
    import { profileManager } from '@core/profile-manager'

    let exportStrongholdChecked: boolean
    let currentPassword = ''
    let currentPasswordError = ''
    let newPassword = ''
    let confirmedPassword = ''
    let passwordChangeBusy = false
    let newPasswordError = ''
    let passwordChangeMessage = ''

    $: passwordStrength = zxcvbn(newPassword)

    function checkPassword(): boolean {
        if (currentPassword && newPassword && confirmedPassword) {
            resetErrors()

            if (newPassword.length > MAX_PASSWORD_LENGTH) {
                newPasswordError = localize('error.password.length', {
                    values: {
                        length: MAX_PASSWORD_LENGTH,
                    },
                })
                return false
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = localize('error.password.doNotMatch')
                return false
            } else if (passwordStrength.score !== 4) {
                let errKey = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && passwordInfo[passwordStrength.feedback.warning]) {
                    errKey = `error.password.${passwordInfo[passwordStrength.feedback.warning]}`
                }
                newPasswordError = localize(errKey)
                return false
            } else {
                return true
            }
        }
        return false
    }

    async function changePassword(): Promise<void> {
        const isPasswordValid = checkPassword()
        if (isPasswordValid) {
            passwordChangeBusy = true
            passwordChangeMessage = localize('general.passwordUpdating')
            const busyStart = Date.now()

            try {
                // TODO: also pass in currentPassword
                await get(profileManager).changeStrongholdPassword(newPassword)

                if (exportStrongholdChecked) {
                    passwordChangeMessage = localize('general.exportingStronghold')

                    return exportStronghold(newPassword, (cancelled, err) => {
                        if (cancelled) {
                            hideBusy('', 0, busyStart)
                        } else {
                            if (err) {
                                currentPasswordError = localize(err)
                                hideBusy(localize('general.passwordFailed'), 0, busyStart)
                            } else {
                                currentPassword = ''
                                newPassword = ''
                                confirmedPassword = ''
                                exportStrongholdChecked = false
                                hideBusy(localize('general.passwordSuccess'), 2000, busyStart)
                            }
                        }
                    })
                } else {
                    currentPassword = ''
                    newPassword = ''
                    confirmedPassword = ''
                    exportStrongholdChecked = false
                    hideBusy(localize('general.passwordSuccess'), 2000, busyStart)
                }
            } catch (err) {
                // TODO: this returns no key, what is the best thing to do here?
                currentPasswordError = localize(JSON.parse(err).payload.error)
                hideBusy(localize('general.passwordFailed'), 0, busyStart)
            }
        }
    }

    function resetErrors() {
        currentPasswordError = ''
        newPasswordError = ''
        passwordChangeBusy = false
        passwordChangeMessage = ''
    }

    function clearPasswordMessage(): void {
        setTimeout(() => (passwordChangeMessage = ''), 2000)
    }

    function hideBusy(message: string, timeout: number, busyStart: number): void {
        const diff = Date.now() - busyStart
        if (diff < timeout) {
            setTimeout(() => {
                passwordChangeBusy = false
                passwordChangeMessage = message
                clearPasswordMessage()
            }, timeout - diff)
        } else {
            passwordChangeBusy = false
            passwordChangeMessage = message
            clearPasswordMessage()
        }
    }
</script>

<form id="form-change-password">
    <Text type="h4" classes="mb-3">{localize('views.settings.changePassword.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.changePassword.description')}</Text>
    <PasswordInput
        error={currentPasswordError}
        classes="mb-5"
        bind:value={currentPassword}
        showRevealToggle
        placeholder={localize('general.currentPassword')}
        disabled={passwordChangeBusy}
        submitHandler={checkPassword}
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
        disabled={passwordChangeBusy}
        submitHandler={checkPassword}
    />
    <PasswordInput
        classes="mb-5"
        bind:value={confirmedPassword}
        showRevealToggle
        placeholder={localize('general.confirmNewPassword')}
        disabled={passwordChangeBusy}
        submitHandler={checkPassword}
    />
    <Checkbox
        classes="mb-5"
        label={localize('actions.exportNewStronghold')}
        bind:checked={exportStrongholdChecked}
        disabled={passwordChangeBusy}
    />
    <div class="flex flex-row items-center">
        <Button
            medium
            disabled={!currentPassword || !newPassword || !confirmedPassword || passwordChangeBusy}
            onClick={changePassword}
        >
            {localize('views.settings.changePassword.title')}
        </Button>
        <Spinner busy={passwordChangeBusy} message={passwordChangeMessage} classes="ml-2" />
    </div>
</form>
