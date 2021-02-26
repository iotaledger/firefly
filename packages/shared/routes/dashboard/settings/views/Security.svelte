<script>
    import { get } from 'svelte/store'
    import zxcvbn from 'zxcvbn'
    import { Text, Dropdown, Password, Button, Checkbox } from 'shared/components'
    import { updateProfile, activeProfile, removeProfile } from 'shared/lib/profile'
    import { api, destroyActor } from 'shared/lib/wallet'
    import { openPopup } from 'shared/lib/popup'

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
    let passwordError = ''

    let currentPincode = ''
    let newPincode = ''
    let confirmedPincode = ''
    let pincodeError = ''

    $: passwordStrength = zxcvbn(newPassword)

    const PincodeManager = window['Electron']['PincodeManager']

    function reset() {
        PincodeManager.remove(get(activeProfile).id).then((isRemoved) => {
            if (!isRemoved) {
                throw new Error('Something went wrong removing pincode entry.')
            }

            // Remove storage
            api.removeStorage({
                onSuccess(res) {
                    // Destroy wallet.rs actor for this profile
                    destroyActor(activeProfile.id)

                    // Remove profile from (local) storage
                    removeProfile(activeProfile.id)

                    // Navigate
                    navigate({ reset: true })
                },
                onError(error) {
                    console.error(error)
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

    function exportStronghold() {
        window['Electron']
            .getStrongholdBackupDestination()
            .then((result) => {
                if (result) {
                    api.backup(result, {
                        onSuccess() {
                            updateProfile('lastStrongholdBackupTime', new Date())

                            if ('function' === typeof callback) {
                                callback()
                            }
                        },
                        onError(error) {
                            console.error(error)
                        },
                    })
                }
            })
            .catch((error) => console.error(error))
    }

    function changePassword() {
        const _changePassword = () => {
            api.changeStrongholdPassword(currentPassword, newPassword, {
                onSuccess() {},
                onError(err) {
                    // TODO: Add proper error handling
                    if (err.payload.error.includes('try another password')){
                        passwordError = locale('error.password.incorrect')
                    }
                },
            })
        }

        if (newPassword !== confirmedPassword) {
            passwordError = locale('error.password.doNotMatch')
        } else if (passwordStrength.score !== 4) {
            passwordError = passwordStrength.feedback.warning
                ? locale(`error.password.${passwordInfo[passwordStrength.feedback.warning]}`)
                : locale('error.password.tooWeak');
        } else {
            if (exportStrongholdChecked) {
                  return exportStronghold(_changePassword)
             }
            _changePassword()
        }
    }

    function changePincode() {
        if (newPincode.length !== 6) {
            pincodeError = locale('error.pincode.length')
        } else if (newPincode !== confirmedPincode) {
            pincodeError = locale('error.pincode.match')
        } else {
            PincodeManager.verify(get(activeProfile).id, currentPincode)
            .then((valid) => {
                if (valid) {
                    return new Promise((resolve, reject) => {
                        api.setStoragePassword(newPincode, {
                            onSuccess() {
                                PincodeManager.set(get(activeProfile).id, newPincode)
                                    .then(resolve)
                                    .then(() => {
                                        currentPincode = ''
                                        newPincode = ''
                                        confirmedPincode = ''
                                    })
                                    .catch(reject)
                            },
                            onError(error) {
                                reject(error)
                            },
                        })
                    })
                } else {
                    pincodeError = locale('error.pincode.incorrect')
                }
            })
            .catch(console.error)
        }
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
            value={assignTimeoutOptionLabel($activeProfile.settings.lockScreenTimeout)}
            items={lockScreenTimeoutOptions} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="changePassword" class="w-3/4">
        <form id="form-change-password" on:submit={changePassword}>
            <Text type="h4" classes="mb-3">{locale('views.settings.changePassword.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.changePassword.description')}</Text>
            <Password
                error={passwordError}
                classes="mb-8"
                bind:value={currentPassword}
                showRevealToggle
                {locale}
                placeholder={locale('general.currentPassword')} />
            <Password
                classes="mb-4"
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
                disabled={!currentPassword || !newPassword || !confirmedPassword}
            >
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
                error={pincodeError}
                classes="mb-4"
                bind:value={currentPincode}
                showRevealToggle
                {locale}
                maxlength="6"
                numeric
                placeholder={locale('views.settings.changePincode.currentPincode')} />
            <Password
                classes="mb-4"
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
                classes="w-1/4"
                disabled={!currentPincode || !newPincode || !confirmedPincode}
            >
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
