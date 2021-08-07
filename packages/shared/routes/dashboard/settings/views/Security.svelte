<script lang="typescript">
    import { Button, Checkbox, Dropdown, HR, Password, Pin, Spinner, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { showAppNotification } from 'shared/lib/notifications'
    import passwordInfo from 'shared/lib/password'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName, PIN_LENGTH } from 'shared/lib/utils'
    import { api, MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import zxcvbn from 'zxcvbn'

    export let locale

    function assignTimeoutOptionLabel(timeInMinutes) {
        if (timeInMinutes >= 60) {
            return locale('views.settings.appLock.durationHour', { values: { time: timeInMinutes / 60 } })
        }

        return locale('views.settings.appLock.durationMinute', { values: { time: timeInMinutes } })
    }

    const lockScreenTimeoutOptions = [1, 5, 10, 30, 60].map((time) => ({ value: time, label: assignTimeoutOptionLabel(time) }))

    let exportStrongholdChecked
    let currentPassword = ''
    let newPassword = ''
    let confirmedPassword = ''
    let currentPasswordError = ''
    let newPasswordError = ''
    let exportBusy = false
    let exportMessage = ''

    let currentPincode = ''
    let newPincode = ''
    let confirmedPincode = ''
    let currentPincodeError = ''
    let newPincodeError = ''
    let confirmationPincodeError = ''
    let pinCodeBusy = false
    let pinCodeMessage = ''

    let passwordChangeBusy = false
    let passwordChangeMessage = ''

    $: passwordStrength = zxcvbn(newPassword)

    function handleExportClick() {
        resetErrors()

        const _callback = (cancelled, err) => {
            setTimeout(
                () => {
                    exportMessage = ''
                },
                cancelled ? 0 : 2000
            )
            exportBusy = false
            if (!cancelled) {
                if (err) {
                    exportMessage = locale('general.exportingStrongholdFailed')
                    showAppNotification({
                        type: 'error',
                        message: locale(err),
                    })
                } else {
                    exportMessage = locale('general.exportingStrongholdSuccess')
                }
            }
        }

        openPopup({
            type: 'password',
            props: {
                onSuccess: (password) => {
                    exportBusy = true
                    exportMessage = locale('general.exportingStronghold')
                    exportStronghold(password, _callback)
                },
                returnPassword: true,
                subtitle: locale('popups.password.backup'),
            },
        })
    }

    function exportStronghold(password: string, callback?: (cancelled: boolean, err?: string) => void) {
        Electron.getStrongholdBackupDestination(getDefaultStrongholdName())
            .then((result) => {
                if (result) {
                    api.backup(result, password, {
                        onSuccess() {
                            updateProfile('lastStrongholdBackupTime', new Date())
                            callback(false)
                        },
                        onError(err) {
                            callback(false, err.error)
                        },
                    })
                } else {
                    callback(true)
                }
            })
            .catch((err) => {
                callback(false, err.error)
            })
    }

    function changePassword() {
        if (currentPassword && newPassword && confirmedPassword) {
            resetErrors()

            if (newPassword.length > MAX_PASSWORD_LENGTH) {
                newPasswordError = locale('error.password.length', {
                    values: {
                        length: MAX_PASSWORD_LENGTH,
                    },
                })
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = locale('error.password.doNotMatch')
            } else if (passwordStrength.score !== 4) {
                let errKey = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && passwordInfo[passwordStrength.feedback.warning]) {
                    errKey = `error.password.${passwordInfo[passwordStrength.feedback.warning]}`
                }
                newPasswordError = locale(errKey)
            } else {
                passwordChangeBusy = true
                passwordChangeMessage = locale('general.passwordUpdating')
                let busyStart = Date.now()
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
                            passwordChangeMessage = locale('general.exportingStronghold')

                            return exportStronghold(newPassword, (cancelled, err) => {
                                if (cancelled) {
                                    _hideBusy('', 0)
                                } else {
                                    if (err) {
                                        currentPasswordError = locale(err)
                                        _hideBusy(locale('general.passwordFailed'), 0)
                                    } else {
                                        currentPassword = ''
                                        newPassword = ''
                                        confirmedPassword = ''
                                        exportStrongholdChecked = false
                                        _hideBusy(locale('general.passwordSuccess'), 2000)
                                    }
                                }
                            })
                        } else {
                            currentPassword = ''
                            newPassword = ''
                            confirmedPassword = ''
                            exportStrongholdChecked = false
                            _hideBusy(locale('general.passwordSuccess'), 2000)
                        }
                    },
                    onError(err) {
                        currentPasswordError = locale(err.error)
                        _hideBusy(locale('general.passwordFailed'), 0)
                    },
                })
            }
        }
    }

    function changePincode() {
        if (currentPincode && newPincode && confirmedPincode) {
            resetErrors()

            if (newPincode.length !== PIN_LENGTH) {
                newPincodeError = locale('error.pincode.length', {
                    values: {
                        length: PIN_LENGTH,
                    },
                })
            } else if (newPincode !== confirmedPincode) {
                confirmationPincodeError = locale('error.pincode.match')
            } else {
                pinCodeBusy = true
                pinCodeMessage = locale('general.pinCodeUpdating')

                const _clear = (err?) => {
                    setTimeout(() => {
                        pinCodeMessage = ''
                    }, 2000)
                    pinCodeBusy = false
                    if (err) {
                        currentPincodeError = err
                        pinCodeMessage = locale('general.pinCodeFailed')
                    } else {
                        pinCodeMessage = locale('general.pinCodeSuccess')
                    }
                }

                Electron.PincodeManager.verify(get(activeProfile)?.id, currentPincode)
                    .then((valid) => {
                        if (valid) {
                            return new Promise<void>((resolve, reject) => {
                                api.setStoragePassword(newPincode, {
                                    onSuccess() {
                                        Electron.PincodeManager.set(get(activeProfile)?.id, newPincode)
                                            .then(() => {
                                                currentPincode = ''
                                                newPincode = ''
                                                confirmedPincode = ''
                                                _clear()
                                                resolve()
                                            })
                                            .catch(reject)
                                    },
                                    onError(err) {
                                        _clear(locale(err.error))
                                    },
                                })
                            })
                        } else {
                            _clear(locale('error.pincode.incorrect'))
                        }
                    })
                    .catch((err) => {
                        _clear(err.message)
                    })
            }
        }
    }

    function resetErrors() {
        currentPasswordError = ''
        newPasswordError = ''
        currentPincodeError = ''
        newPincodeError = ''
        confirmationPincodeError = ''
        passwordChangeBusy = false
        passwordChangeMessage = ''
        pinCodeBusy = false
        pinCodeMessage = ''
        exportBusy = false
        exportMessage = ''
    }

    function reset() {
        openPopup({ type: 'deleteProfile' })
    }
</script>

<div>
    <!-- TODO: ledger, remove this also from settings index -->
    {#if $isSoftwareProfile}
        <section id="exportStronghold" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.exportStronghold.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
            <div class="flex flex-row items-center">
                <Button medium inlineStyle="min-width: 156px;" onClick={handleExportClick} disabled={exportBusy}>
                    {locale('actions.export')}
                </Button>
                <Spinner busy={exportBusy} message={exportMessage} classes="ml-2" />
            </div>
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <section id="appLock" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.appLock.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.appLock.description')}</Text>
        <Dropdown
            onSelect={(option) => {
                updateProfile('settings.lockScreenTimeout', option.value)
            }}
            value={assignTimeoutOptionLabel($activeProfile?.settings.lockScreenTimeout)}
            items={lockScreenTimeoutOptions} />
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <!-- TODO: ledger, remove this also from settings index -->
    {#if $isSoftwareProfile}
        <section id="changePassword" class="w-3/4">
            <form id="form-change-password" on:submit={changePassword}>
                <Text type="h4" classes="mb-3">{locale('views.settings.changePassword.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.changePassword.description')}</Text>
                <Password
                    error={currentPasswordError}
                    classes="mb-5"
                    bind:value={currentPassword}
                    showRevealToggle
                    {locale}
                    placeholder={locale('general.currentPassword')}
                    disabled={passwordChangeBusy}
                    submitHandler={changePassword} />
                <Password
                    error={newPasswordError}
                    classes="mb-4"
                    bind:value={newPassword}
                    showRevealToggle
                    strengthLevels={4}
                    showStrengthLevel
                    strength={passwordStrength.score}
                    {locale}
                    placeholder={locale('general.newPassword')}
                    disabled={passwordChangeBusy}
                    submitHandler={changePassword} />
                <Password
                    classes="mb-5"
                    bind:value={confirmedPassword}
                    showRevealToggle
                    {locale}
                    placeholder={locale('general.confirmNewPassword')}
                    disabled={passwordChangeBusy}
                    submitHandler={changePassword} />
                <Checkbox
                    classes="mb-5"
                    label={locale('actions.exportNewStronghold')}
                    bind:checked={exportStrongholdChecked}
                    disabled={passwordChangeBusy} />
                <div class="flex flex-row items-center">
                    <Button
                        medium
                        form="form-change-password"
                        type="submit"
                        disabled={!currentPassword || !newPassword || !confirmedPassword || passwordChangeBusy}>
                        {locale('views.settings.changePassword.title')}
                    </Button>
                    <Spinner busy={passwordChangeBusy} message={passwordChangeMessage} classes="ml-2" />
                </div>
            </form>
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
    {/if}
    <section id="changePincode" class="w-3/4">
        <form on:submit={changePincode} id="pincode-change-form">
            <Text type="h4" classes="mb-3">{locale('views.settings.changePincode.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.changePincode.description')}</Text>

            <Text type="p" secondary smaller classes="mb-2">{locale('views.settings.changePincode.currentPincode')}</Text>
            <Pin
                smaller
                error={currentPincodeError}
                classes="mb-4"
                bind:value={currentPincode}
                disabled={pinCodeBusy}
                on:submit={changePincode} />
            <Text type="p" secondary smaller classes="mb-2">{locale('views.settings.changePincode.newPincode')}</Text>
            <Pin
                smaller
                error={newPincodeError}
                classes="mb-4"
                bind:value={newPincode}
                disabled={pinCodeBusy}
                on:submit={changePincode} />
            <Text type="p" secondary smaller classes="mb-2">{locale('views.settings.changePincode.confirmNewPincode')}</Text>
            <Pin
                smaller
                error={confirmationPincodeError}
                classes="mb-4"
                bind:value={confirmedPincode}
                disabled={pinCodeBusy}
                on:submit={changePincode} />
            <div class="flex flex-row items-center">
                <Button
                    medium
                    type="submit"
                    form="pincode-change-form"
                    disabled={!currentPincode || !newPincode || !confirmedPincode || pinCodeBusy}>
                    {locale('views.settings.changePincode.action')}
                </Button>
                <Spinner busy={pinCodeBusy} message={pinCodeMessage} classes="ml-2" />
            </div>
        </form>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="deleteProfile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deleteProfile.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deleteProfile.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" warning onClick={reset}>
            {locale('views.settings.deleteProfile.title')}
        </Button>
    </section>
</div>
