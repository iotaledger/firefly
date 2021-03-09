<script lang="typescript">
    import { Button, Checkbox, Dropdown, Password, Spinner, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { showAppNotification } from 'shared/lib/notifications'
    import passwordInfo from 'shared/lib/password'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { PIN_LENGTH } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import zxcvbn from 'zxcvbn'

    function assignTimeoutOptionLabel(timeInMinutes) {
        let label = ''

        if (timeInMinutes >= 60) {
            label = `${timeInMinutes / 60} hour`
        }

        label = `${timeInMinutes} minute`

        return label.includes('1') ? label : `${label}s`
    }

    const lockScreenTimeoutOptions = [1, 5, 10, 30, 60].map((time) => ({ value: time, label: assignTimeoutOptionLabel(time) }))

    export let locale
    export let navigate

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
    let pinCodeBusy = false
    let pinCodeMessage = ''

    let passwordChangeBusy = false
    let passwordChangeMessage = ''

    const MAX_PASSWORD_LENGTH = 256

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

        if (get(activeProfile).isStrongholdLocked) {
            openPopup({
                type: 'password',
                props: {
                    onSuccess: () => {
                        exportBusy = true
                        exportMessage = locale('general.exportingStronghold')
                        exportStronghold(_callback)
                    },
                },
            })
        } else {
            exportBusy = true
            exportMessage = locale('general.exportingStronghold')
            exportStronghold(_callback)
        }
    }

    function exportStronghold(callback?: (cancelled: boolean, err?: string) => void) {
        Electron.getStrongholdBackupDestination()
            .then((result) => {
                if (result) {
                    api.backup(result, {
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
            newPasswordError = passwordStrength.feedback.warning
                ? locale(`error.password.${passwordInfo[passwordStrength.feedback.warning]}`)
                : locale('error.password.tooWeak')
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

                        return exportStronghold((cancelled, err) => {
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

    function changePincode() {
        resetErrors()

        if (newPincode.length !== PIN_LENGTH) {
            newPincodeError = locale('error.pincode.length', {
                values: {
                    length: PIN_LENGTH,
                },
            })
        } else if (newPincode !== confirmedPincode) {
            newPincodeError = locale('error.pincode.match')
        } else {
            pinCodeBusy = true
            pinCodeMessage = locale('general.pinCodeUpdating')

            const _clear = (err?) => {
                setTimeout(() => {
                    pinCodeMessage = ''
                }, 2000)
                pinCodeBusy = false
                if (err) {
                    newPincodeError = err
                    pinCodeMessage = locale('general.pinCodeFailed')
                } else {
                    pinCodeMessage = locale('general.pinCodeSuccess')
                }
            }

            Electron.PincodeManager.verify(get(activeProfile).id, currentPincode)
                .then((valid) => {
                    if (valid) {
                        return new Promise<void>((resolve, reject) => {
                            api.setStoragePassword(newPincode, {
                                onSuccess() {
                                    Electron.PincodeManager.set(get(activeProfile).id, newPincode)
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

    function resetErrors() {
        currentPasswordError = ''
        newPasswordError = ''
        currentPincodeError = ''
        newPincodeError = ''
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
    <section id="exportStronghold" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.exportStronghold.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
        <div class="flex flex-row items-center">
            <Button classes="w-1/4 h-1/2" onClick={handleExportClick} disabled={exportBusy}>{locale('actions.export')}</Button>
            <Spinner busy={exportBusy} message={exportMessage} classes="ml-2" />
        </div>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="appLock" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.appLock.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.appLock.description')}</Text>
        <Dropdown
            onSelect={(option) => {
                updateProfile('settings.lockScreenTimeout', option.value)
            }}
            value={assignTimeoutOptionLabel($activeProfile.settings.lockScreenTimeout)}
            items={lockScreenTimeoutOptions} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="changePassword" class="w-3/4">
        <form id="form-change-password" on:submit={changePassword}>
            <Text type="h4" classes="mb-3">{locale('views.settings.changePassword.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.changePassword.description')}</Text>
            <Password
                error={currentPasswordError}
                classes="mb-1"
                bind:value={currentPassword}
                showRevealToggle
                {locale}
                placeholder={locale('general.currentPassword')}
                disabled={passwordChangeBusy} />
            <Password
                error={newPasswordError}
                classes="mb-1"
                bind:value={newPassword}
                showRevealToggle
                strengthLevels={4}
                showStrengthLevel
                strength={passwordStrength.score}
                {locale}
                placeholder={locale('general.newPassword')}
                disabled={passwordChangeBusy} />
            <Password
                classes="mb-5"
                bind:value={confirmedPassword}
                showRevealToggle
                {locale}
                placeholder={locale('general.confirmNewPassword')}
                disabled={passwordChangeBusy} />
            <Checkbox
                classes="mb-5"
                label={locale('actions.exportNewStronghold')}
                bind:checked={exportStrongholdChecked}
                disabled={passwordChangeBusy} />
            <div class="flex flex-row items-center">
                <Button
                    form="form-change-password"
                    type="submit"
                    classes="w-1/4"
                    disabled={!currentPassword || !newPassword || !confirmedPassword || passwordChangeBusy}>
                    {locale('views.settings.changePassword.title')}
                </Button>
                <Spinner busy={passwordChangeBusy} message={passwordChangeMessage} classes="ml-2" />
            </div>
        </form>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="changePincode" class="w-3/4">
        <form on:submit={changePincode} id="pincode-change-form">
            <Text type="h4" classes="mb-3">{locale('views.settings.changePincode.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.changePincode.description')}</Text>
            <Password
                error={currentPincodeError}
                classes="mb-1"
                bind:value={currentPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.currentPincode')}
                disabled={pinCodeBusy} />
            <Password
                error={newPincodeError}
                classes="mb-1"
                bind:value={newPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.newPincode')}
                disabled={pinCodeBusy} />
            <Password
                classes="mb-5"
                bind:value={confirmedPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.confirmNewPincode')}
                disabled={pinCodeBusy} />
            <div class="flex flex-row items-center">
                <Button
                    type="submit"
                    form="pincode-change-form"
                    classes="w-1/4 mb-5"
                    disabled={!currentPincode || !newPincode || !confirmedPincode || pinCodeBusy}>
                    {locale('views.settings.changePincode.action')}
                </Button>
                <Spinner busy={pinCodeBusy} message={pinCodeMessage} classes="ml-2" />
            </div>
        </form>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="deleteProfile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deleteProfile.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deleteProfile.description')}</Text>
        <Button classes="w-1/4" warning onClick={reset}>{locale('views.settings.deleteProfile.title')}</Button>
    </section>
</div>
