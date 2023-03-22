<script lang="ts">
    import { get } from 'svelte/store'
    import { Button, PinInput, Spinner, Text, HTMLButtonType, ButtonSize, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { Platform } from '@core/app'
    import { PIN_LENGTH } from '@core/utils'

    let currentPincode: string = ''
    let newPincode: string = ''
    let confirmedPincode: string = ''
    let currentPincodeError: string = ''
    let newPincodeError: string = ''
    let confirmationPincodeError = ''
    let busy: boolean = false
    let message: string = ''

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
        message = ''
    }

    function onSuccess(_message: string): void {
        message = _message
        busy = false
        setTimeout(() => {
            resetForm()
        }, 2000)
    }

    function onError(_message: string): void {
        message = _message
        busy = false
        setTimeout(() => {
            message = ''
        }, 2000)
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
                message = localize('error.pincode.empty')
                return false
            }
        } catch (err) {
            message = localize('general.pinCodeFailed')
            return false
        }
    }

    async function changePincode(): Promise<void> {
        if (await validateFormAndSetErrors()) {
            busy = true
            message = localize('general.pinCodeUpdating')
            try {
                await Platform.PincodeManager.set(get(activeProfile)?.id, newPincode)
                onSuccess(localize('general.pinCodeSuccess'))
            } catch {
                onError(localize('general.pinCodeFailed'))
            }
        } else {
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
        >
            {localize('views.settings.changePincode.action')}
        </Button>
        <Spinner {busy} {message} classes="ml-2" />
    </div>
</form>
