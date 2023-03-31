<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { Locale } from '@core/i18n'

    export let locale: Locale
    export let handleCancelClick: () => void
    export let handleContinueClick: () => void

    function onCancelClick() {
        if (handleCancelClick) {
            handleCancelClick()
        }
        closePopup()
    }

    function onContinueClick() {
        if (handleContinueClick) {
            handleContinueClick()
        }
        closePopup()
    }
</script>

<Text type="h4" classes="flex w-full justify-center -mt-4 mb-6">
    {locale('popups.confirmCloseApp.title')}
</Text>
<Text type="p" secondary classes="flex w-full justify-center -mt-4 mb-6">
    {locale('popups.confirmCloseApp.body')}
</Text>
<div class="flex flex-row flex-nowrap w-full space-x-4">
    <Button classes="w-full" secondary onClick={onCancelClick}>{locale('actions.cancel')}</Button>
    <Button classes="w-full" onClick={onContinueClick}>{locale('actions.continue')}</Button>
</div>
