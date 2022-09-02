<script lang="typescript">
    import { Button, Pin, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { Platform } from 'shared/lib/platform'
    import { mobile, isKeyboardOpened, getKeyboardTransitionSpeed } from '@lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { PIN_LENGTH } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    let currentPincode = ''
    let newPincode = ''
    let confirmedPincode = ''
    let currentPincodeError = ''
    let newPincodeError = ''
    let confirmationPincodeError = ''
    let pinCodeBusy = false
    let pinCodeMessage = ''

    function changePincode() {
        if (currentPincode && newPincode && confirmedPincode) {
            reset()

            if (newPincode.length !== PIN_LENGTH) {
                newPincodeError = localize('error.pincode.length', {
                    values: {
                        length: PIN_LENGTH,
                    },
                })
            } else if (newPincode !== confirmedPincode) {
                confirmationPincodeError = localize('error.pincode.match')
            } else {
                pinCodeBusy = true
                pinCodeMessage = localize('general.pinCodeUpdating')

                const _clear = (err?) => {
                    setTimeout(() => {
                        pinCodeMessage = ''
                    }, 2000)
                    pinCodeBusy = false
                    if (err) {
                        currentPincodeError = err
                        pinCodeMessage = localize('general.pinCodeFailed')
                    } else {
                        pinCodeMessage = localize('general.pinCodeSuccess')
                    }
                }

                Platform.PincodeManager.verify(get(activeProfile)?.id, currentPincode)
                    .then((valid) => {
                        if (valid) {
                            return new Promise<void>((resolve, reject) => {
                                api.setStoragePassword(newPincode, {
                                    onSuccess() {
                                        Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
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
                                        _clear(localize(err.error))
                                    },
                                })
                            })
                        } else {
                            _clear(localize('error.pincode.incorrect'))
                        }
                    })
                    .catch((err) => {
                        _clear(err.message)
                    })
            }
        }
    }

    function reset() {
        currentPincodeError = ''
        newPincodeError = ''
        confirmationPincodeError = ''
        pinCodeBusy = false
        pinCodeMessage = ''
    }
</script>

<!-- TODO: improve UX for mobile, 3 step screen -->
<form
    on:submit|preventDefault={changePincode}
    id="pincode-change-form"
    style="margin-top: {$mobile && $isKeyboardOpened
        ? '-20%'
        : '0px'}; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
        'ms'} var(--transition-scroll)"
>
    <Text type="h4" classes="mb-3">{localize('views.settings.changePincode.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.changePincode.description')}</Text>
    <Text type="p" secondary smaller={!$mobile} classes="mb-2"
        >{localize('views.settings.changePincode.currentPincode')}</Text
    >
    <Pin
        smaller
        error={currentPincodeError}
        classes="mb-4"
        bind:value={currentPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <Text type="p" secondary smaller={!$mobile} classes="mb-2"
        >{localize('views.settings.changePincode.newPincode')}</Text
    >
    <Pin
        smaller
        error={newPincodeError}
        classes="mb-4"
        bind:value={newPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <Text type="p" secondary smaller={!$mobile} classes="mb-2"
        >{localize('views.settings.changePincode.confirmNewPincode')}</Text
    >
    <Pin
        smaller
        error={confirmationPincodeError}
        classes="mb-4"
        bind:value={confirmedPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <div class="flex flex-row items-center">
        <Button
            medium
            type="submit"
            form="pincode-change-form"
            disabled={!currentPincode || !newPincode || !confirmedPincode || pinCodeBusy}
        >
            {localize('views.settings.changePincode.action')}
        </Button>
        <Spinner busy={pinCodeBusy} message={pinCodeMessage} classes="ml-2" />
    </div>
</form>
