<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { Button, Checkbox, Text, TextHint } from 'shared/components'
    import { appSettings, initAppSettings, isAwareOfCrashReporting } from 'shared/lib/appSettings'
    import { localize } from '@core/i18n'
    import { closePopup as closePopupInternal } from 'shared/lib/popup'
    import { AppSettings } from 'shared/lib/typings/app'

    let sendCrashReports = true

    const closePopup = () => {
        isAwareOfCrashReporting.set(true)

        closePopupInternal(true)
    }

    const handleConfirmClick = () => {
        appSettings.set(<AppSettings>{ ...$appSettings, sendCrashReports })

        closePopup()
    }

    onDestroy(() => closePopup)
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">{localize('popups.crashReporting.title')}</Text>
    <Text type="p" secondary>{localize('popups.crashReporting.body')}</Text>
    <Checkbox label={localize('popups.crashReporting.checkbox')} bind:checked={sendCrashReports} classes="mt-4" />
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button secondary classes="w-1/2" onClick={closePopup}>{localize('actions.close')}</Button>
    <Button autofocus classes="w-1/2" onClick={handleConfirmClick}>{localize('actions.confirm')}</Button>
</div>
