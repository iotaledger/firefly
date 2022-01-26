<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Button, Checkbox, Text } from 'shared/components'
    import { appSettings, isAwareOfDiagnosticSharing } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
    import { closePopup as closePopupInternal } from 'shared/lib/popup'
    import { AppSettings } from 'shared/lib/typings/app'

    let sendDiagnostics = true

    const closePopup = () => {
        isAwareOfDiagnosticSharing.set(true)

        closePopupInternal()
    }

    const handleConfirmClick = () => {
        appSettings.set(<AppSettings>{ ...$appSettings, sendDiagnostics, })

        closePopup()
    }

    onDestroy(() => closePopup)
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">Send diagnostic reports</Text>
    <Text type="p" secondary>
        If checked, Firefly will send diagnostic reports in the event that an error
        or crash has occurred.
    </Text>
    <Checkbox label="Send diagnostic reports" bind:checked={sendDiagnostics} classes="mt-4" />
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button secondary classes="w-1/2" onClick={closePopup}>{localize('actions.close')}</Button>
    <Button autofocus classes="w-1/2" onClick={handleConfirmClick}>{localize('actions.confirm')}</Button>
</div>
