<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { PIN_LENGTH } from '@core/utils'
    import { Button, ButtonSize, HTMLButtonType, PinInput, Text, TextType } from '@ui'
    import { get } from 'svelte/store'

    let currentPincode: string = ''
    let newPincode: string = ''
    let confirmedPincode: string = ''
    let currentPincodeError: string = ''
    let newPincodeError: string = ''
    let confirmationPincodeError = ''
    let busy: boolean = false

    $: currentPincode, newPincode, confirmedPincode, resetErrors()

    function resetErrors(): void {
        currentPincodeError = ''
        newPincodeError = ''
        confirmationPincodeError = ''
    }

    function resetInputs(): void {
        currentPincode = ''
        newPincode = ''
        confirmedPincode = ''
    }

    function resetForm(): void {
        resetInputs()
        resetErrors()
    }

    function onSuccess(_message: string): void {
        busy = false
        showAppNotification({
            type: 'success',
            alert: true,
            message: _message,
        })
        resetForm()
    }

    function onError(_message: string): void {
        busy = false
        showAppNotification({
            type: 'error',
            alert: true,
            message: _message,
        })
    }

    async function validateFormAndSetErrors(): Promise<boolean> {
        try {
            if (currentPincode && newPincode && confirmedPincode) {
                if (newPincode.length !== PIN_LENGTH) {
                    newPincodeError = localize('error.pincode.length', {
                        values: {
                            length: PIN_LENGTH,
                        },
                    })
                    return false
                } else if (newPincode !== confirmedPincode) {
                    confirmationPincodeError = localize('error.pincode.match')
                    return false
                } else if (!(await Platform.PincodeManager.verify(get(activeProfile)?.id, currentPincode))) {
                    currentPincodeError = localize('error.pincode.incorrect')
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }

    async function changePincode(): Promise<void> {
        try {
            if (await validateFormAndSetErrors()) {
                busy = true
                await Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
                onSuccess(localize('general.pinCodeSuccess'))
            } else {
                onError(localize('general.pinCodeFailed'))
            }
        } catch {
            onError(localize('general.pinCodeFailed'))
        }
    }
</script>

<form on:submit|preventDefault={changePincode} id="pincode-change-form">
    <Text type={TextType.h4} classes="mb-3">{localize('views.settings.changePincode.title')}</Text>
    <Text type={TextType.p} secondary classes="mb-5">{localize('views.settings.changePincode.description')}</Text>
    <Text type={TextType.p} secondary smaller classes="mb-2"
        >{localize('views.settings.changePincode.currentPincode')}</Text
    >
    <PinInput
        smaller
        error={currentPincodeError}
        classes="mb-4"
        bind:value={currentPincode}
        disabled={busy}
        on:submit={changePincode}
    />
    <Text type={TextType.p} secondary smaller classes="mb-2">{localize('views.settings.changePincode.newPincode')}</Text
    >
    <PinInput
        smaller
        error={newPincodeError}
        classes="mb-4"
        bind:value={newPincode}
        disabled={busy}
        on:submit={changePincode}
    />
    <Text type={TextType.p} secondary smaller classes="mb-2"
        >{localize('views.settings.changePincode.confirmNewPincode')}</Text
    >
    <PinInput
        smaller
        error={confirmationPincodeError}
        classes="mb-4"
        bind:value={confirmedPincode}
        disabled={busy}
        on:submit={changePincode}
    />
    <div class="flex flex-row items-center">
        <Button
            size={ButtonSize.Medium}
            type={HTMLButtonType.Submit}
            disabled={busy ||
                currentPincode?.length < PIN_LENGTH ||
                newPincode?.length < PIN_LENGTH ||
                confirmedPincode?.length < PIN_LENGTH}
            isBusy={busy}
        >
            {localize('views.settings.changePincode.action')}
        </Button>
    </div>
</form>
