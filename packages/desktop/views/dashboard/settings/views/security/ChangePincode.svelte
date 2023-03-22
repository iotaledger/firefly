<script lang="ts">
    import { get } from 'svelte/store'
    import { Button, PinInput, Spinner, Text, HTMLButtonType, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { Platform } from '@core/app'
    import { PIN_LENGTH } from '@core/utils'

    let currentPincode = ''
    let newPincode = ''
    let confirmedPincode = ''
    let currentPincodeError = ''
    let newPincodeError = ''
    let confirmationPincodeError = ''
    let pinCodeBusy = false
    let pinCodeMessage = ''

    async function changePincode(): void {
        if (currentPincode && newPincode && confirmedPincode) {
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

                const _clear: (err?: unknown) => void = (err?) => {
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
                    reset()
                }

                try {
                    const isValid = await Platform.PincodeManager.verify(get(activeProfile)?.id, currentPincode)
                    if (isValid) {
                        try {
                            await Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
                            _clear()
                        } catch (err) {
                            _clear(err.message)
                        }
                        Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
                    } else {
                        _clear(localize('error.pincode.incorrect'))
                    }
                } catch (err) {
                    _clear(localize('error.pincode.incorrect'))
                }
            }
        }
    }

    function reset(): void {
        currentPincode = ''
        newPincode = ''
        confirmedPincode = ''
        currentPincodeError = ''
        newPincodeError = ''
        confirmationPincodeError = ''
        pinCodeBusy = false
        pinCodeMessage = ''
    }
</script>

<form on:submit|preventDefault={changePincode} id="pincode-change-form">
    <Text type="h4" classes="mb-3">{localize('views.settings.changePincode.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.changePincode.description')}</Text>
    <Text type="p" secondary smaller classes="mb-2">{localize('views.settings.changePincode.currentPincode')}</Text>
    <PinInput
        smaller
        error={currentPincodeError}
        classes="mb-4"
        bind:value={currentPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <Text type="p" secondary smaller classes="mb-2">{localize('views.settings.changePincode.newPincode')}</Text>
    <PinInput
        smaller
        error={newPincodeError}
        classes="mb-4"
        bind:value={newPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <Text type="p" secondary smaller classes="mb-2">{localize('views.settings.changePincode.confirmNewPincode')}</Text>
    <PinInput
        smaller
        error={confirmationPincodeError}
        classes="mb-4"
        bind:value={confirmedPincode}
        disabled={pinCodeBusy}
        on:submit={changePincode}
    />
    <div class="flex flex-row items-center">
        <Button
            size={ButtonSize.Medium}
            type={HTMLButtonType.Submit}
            disabled={!currentPincode || !newPincode || !confirmedPincode || pinCodeBusy}
        >
            {localize('views.settings.changePincode.action')}
        </Button>
        <Spinner busy={pinCodeBusy} message={pinCodeMessage} classes="ml-2" />
    </div>
</form>
