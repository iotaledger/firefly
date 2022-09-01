<script lang="typescript">
    import { Button, Checkbox, Password, Spinner, Text } from 'shared/components'
    import { mobile, isKeyboardOpened, getKeyboardTransitionSpeed } from '@lib/app'
    import { localize } from '@core/i18n'
    import passwordInfo from 'shared/lib/password'
    import { api, MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import zxcvbn from 'zxcvbn'

    export let exportStronghold: (password, callback?: (cancelled: boolean, err?) => void) => void

    let exportStrongholdChecked
    let currentPassword = ''
    let currentPasswordError = ''
    let newPassword = ''
    let confirmedPassword = ''
    let passwordChangeBusy = false
    let newPasswordError = ''
    let passwordChangeMessage = ''

    $: passwordStrength = zxcvbn(newPassword)

    function changePassword() {
        if (currentPassword && newPassword && confirmedPassword) {
            reset()

            if (newPassword.length > MAX_PASSWORD_LENGTH) {
                newPasswordError = localize('error.password.length', {
                    values: {
                        length: MAX_PASSWORD_LENGTH,
                    },
                })
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = localize('error.password.doNotMatch')
            } else if (passwordStrength.score !== 4) {
                let errKey = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && passwordInfo[passwordStrength.feedback.warning]) {
                    errKey = `error.password.${passwordInfo[passwordStrength.feedback.warning]}`
                }
                newPasswordError = localize(errKey)
            } else {
                passwordChangeBusy = true
                passwordChangeMessage = localize('general.passwordUpdating')
                const busyStart = Date.now()
                const _clearMessage = () => {
                    setTimeout(() => (passwordChangeMessage = ''), 2000)
                }
                const _hideBusy = (message, timeout) => {
                    const diff = Date.now() - busyStart
                    if (diff < timeout) {
                        setTimeout(() => {
                            passwordChangeBusy = false
                            passwordChangeMessage = message
                            _clearMessage()
                        }, timeout - diff)
                    } else {
                        passwordChangeBusy = false
                        passwordChangeMessage = message
                        _clearMessage()
                    }
                }

                api.changeStrongholdPassword(currentPassword, newPassword, {
                    onSuccess() {
                        if (exportStrongholdChecked) {
                            passwordChangeMessage = localize('general.exportingStronghold')

                            return exportStronghold(newPassword, (cancelled, err) => {
                                if (cancelled) {
                                    _hideBusy('', 0)
                                } else {
                                    if (err) {
                                        currentPasswordError = localize(err)
                                        _hideBusy(localize('general.passwordFailed'), 0)
                                    } else {
                                        currentPassword = ''
                                        newPassword = ''
                                        confirmedPassword = ''
                                        exportStrongholdChecked = false
                                        _hideBusy(localize('general.passwordSuccess'), 2000)
                                    }
                                }
                            })
                        } else {
                            currentPassword = ''
                            newPassword = ''
                            confirmedPassword = ''
                            exportStrongholdChecked = false
                            _hideBusy(localize('general.passwordSuccess'), 2000)
                        }
                    },
                    onError(err) {
                        currentPasswordError = localize(err.error)
                        _hideBusy(localize('general.passwordFailed'), 0)
                    },
                })
            }
        }
    }

    function reset() {
        currentPasswordError = ''
        newPasswordError = ''
        passwordChangeBusy = false
        passwordChangeMessage = ''
    }
</script>

<!-- TODO: improve UX for mobile, 3 step screen -->
<form
    id="form-change-password"
    on:submit|preventDefault={changePassword}
    style="margin-top: {$mobile && $isKeyboardOpened
        ? '-25%'
        : '0px'}; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
        'ms'} var(--transition-scroll)"
>
    <Text type="h4" classes="mb-3">{localize('views.settings.changePassword.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.changePassword.description')}</Text>
    <Password
        error={currentPasswordError}
        classes="mb-5"
        bind:value={currentPassword}
        showRevealToggle
        locale={localize}
        placeholder={localize('general.currentPassword')}
        disabled={passwordChangeBusy}
        submitHandler={changePassword}
    />
    <Password
        error={newPasswordError}
        classes="mb-4"
        bind:value={newPassword}
        showRevealToggle
        strengthLevels={4}
        showStrengthLevel
        strength={passwordStrength.score}
        locale={localize}
        placeholder={localize('general.newPassword')}
        disabled={passwordChangeBusy}
        submitHandler={changePassword}
    />
    <Password
        classes="mb-5"
        bind:value={confirmedPassword}
        showRevealToggle
        locale={localize}
        placeholder={localize('general.confirmNewPassword')}
        disabled={passwordChangeBusy}
        submitHandler={changePassword}
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
            form="form-change-password"
            type="submit"
            disabled={!currentPassword || !newPassword || !confirmedPassword || passwordChangeBusy}
        >
            {localize('views.settings.changePassword.title')}
        </Button>
        <Spinner busy={passwordChangeBusy} message={passwordChangeMessage} classes="ml-2" />
    </div>
</form>
