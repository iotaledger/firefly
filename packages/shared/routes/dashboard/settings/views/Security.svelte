<script lang="typescript">
    import { Button, Checkbox, Dropdown, Password, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import passwordInfo from 'shared/lib/password'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, removeProfile, updateProfile } from 'shared/lib/profile'
    import { api, destroyActor, resetWallet } from 'shared/lib/wallet'
    import { resetRouter } from 'shared/lib/router'
    import { get } from 'svelte/store'
    import zxcvbn from 'zxcvbn'
    import { showAppNotification } from 'shared/lib/notifications'

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

    let currentPincode = ''
    let newPincode = ''
    let confirmedPincode = ''
    let currentPincodeError = ''
    let newPincodeError = ''

    const MAX_PASSWORD_LENGTH = 256
    const MAX_PINCODE_LENGTH = 6

    $: passwordStrength = zxcvbn(newPassword)

    function reset() {
        Electron.PincodeManager.remove(get(activeProfile).id).then((isRemoved) => {
            if (!isRemoved) {
                throw new Error('Something went wrong removing pincode entry.')
            }

            // Remove storage
            api.removeStorage({
                onSuccess(res) {
                    // Destroy wallet.rs actor for this profile
                    destroyActor($activeProfile.id)

                    // Remove profile from (local) storage
                    removeProfile($activeProfile.id)

                    resetWallet()
                    resetRouter()
                },
                onError(err) {
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        })
    }

    function handleExportClick() {
        if (get(activeProfile).isStrongholdLocked) {
            openPopup({ type: 'password', props: { onSuccess: exportStronghold } })
        } else {
            exportStronghold()
        }
    }

    function exportStronghold(callback?: () => void) {
        Electron.getStrongholdBackupDestination()
            .then((result) => {
                if (result) {
                    api.backup(result, {
                        onSuccess() {
                            updateProfile('lastStrongholdBackupTime', new Date())

                            if ('function' === typeof callback) {
                                callback()
                            }
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                        },
                    })
                }
            })
            .catch((err) => showAppNotification({
                type: 'error',
                message: locale(err.error),
            }))
    }

    function changePassword() {
        resetErrors()
        const _changePassword = () => {
            console.log('changing password')
            api.changeStrongholdPassword(currentPassword, newPassword, {
                onSuccess() {},
                onError(err) {
                    currentPasswordError = locale(err.error)
                },
            })
        }

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
            if (exportStrongholdChecked) {
                return exportStronghold(_changePassword)
            }
            _changePassword()
        }
    }

    function changePincode() {
        resetErrors()
        if (newPincode.length !== MAX_PINCODE_LENGTH) {
            newPincodeError = locale('error.pincode.length', {
                values: {
                    length: MAX_PINCODE_LENGTH,
                },
            })
        } else if (newPincode !== confirmedPincode) {
            newPincodeError = locale('error.pincode.match')
        } else {
            Electron.PincodeManager.verify(get(activeProfile).id, currentPincode)
                .then((valid) => {
                    if (valid) {
                        return new Promise((resolve, reject) => {
                            api.setStoragePassword(newPincode, {
                                onSuccess() {
                                    Electron.PincodeManager.set(get(activeProfile).id, newPincode)
                                        .then(resolve)
                                        .then(() => {
                                            currentPincode = ''
                                            newPincode = ''
                                            confirmedPincode = ''
                                        })
                                        .catch(reject)
                                },
                                onError(err) {
                                    showAppNotification({
                                        type: 'error',
                                        message: locale(err.error),
                                    })
                                },
                            })
                        })
                    } else {
                        currentPincodeError = locale('error.pincode.incorrect')
                    }
                })
                .catch(console.error)
        }
    }

    function resetErrors() {
        currentPasswordError = ''
        newPasswordError = ''
        currentPincodeError = ''
        newPincodeError = ''
    }
</script>

<div>
    <section id="exportStronghold" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.exportStronghold.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
        <Button classes="w-1/4 h-1/2" onClick={handleExportClick}>{locale('actions.export')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
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
                autofocus />
            <Password
                error={newPasswordError}
                classes="mb-1"
                bind:value={newPassword}
                showRevealToggle
                strengthLevels={4}
                showStrengthLevel
                strength={passwordStrength.score}
                {locale}
                placeholder={locale('general.newPassword')} />
            <Password
                classes="mb-5"
                bind:value={confirmedPassword}
                showRevealToggle
                {locale}
                placeholder={locale('general.confirmNewPassword')} />
            <Checkbox classes="mb-5" label={locale('actions.exportNewStronghold')} bind:checked={exportStrongholdChecked} />
            <Button
                form="form-change-password"
                type="submit"
                classes="w-1/4"
                disabled={!currentPassword || !newPassword || !confirmedPassword}>
                {locale('views.settings.changePassword.title')}
            </Button>
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
                placeholder={locale('views.settings.changePincode.currentPincode')} />
            <Password
                error={newPincodeError}
                classes="mb-1"
                bind:value={newPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.newPincode')} />
            <Password
                classes="mb-5"
                bind:value={confirmedPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.confirmNewPincode')} />
            <Button
                type="submit"
                form="pincode-change-form"
                classes="w-1/4 mb-5"
                disabled={!currentPincode || !newPincode || !confirmedPincode}>
                {locale('views.settings.changePincode.action')}
            </Button>
        </form>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="resetWallet" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.resetWallet.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.resetWallet.description')}</Text>
        <Button classes="w-1/4" onClick={reset}>{locale('views.settings.resetWallet.title')}</Button>
    </section>
</div>
