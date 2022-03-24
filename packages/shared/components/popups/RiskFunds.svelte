<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let subtitle

    export let onProceed = (): void => {}

    function handleCancelClick() {
        closePopup()
    }
</script>

<div class="mb-8">
    <Text type="h4" classes="mb-5">{locale('popups.riskFunds.title')}</Text>
    <Text type="p" secondary>{subtitle ?? locale('popups.riskFunds.body1')}</Text>
</div>
<div class="flex flex-row justify-between w-full space-x-4 md:px-8">
    <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
    <Button classes="w-1/2" onClick={onProceed}>{locale('actions.proceedAnyway')}</Button>
</div>
