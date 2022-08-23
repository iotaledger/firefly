<script lang="typescript">
    import { Button, Text, Animation } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    function handleMigrateClick() {
        closePopup(true)
    }

    function handleCloseClick() {
        closePopup(true)
    }
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">{locale('popups.ledgerMigrateIndex.title')}</Text>
    <Text type="p" secondary>{locale('popups.ledgerMigrateIndex.body')}</Text>
</div>
<div class="relative w-full h-1/2 bg-white dark:bg-gray-900 justify-center">
    <Animation animation="import-from-text-success-desktop" />
</div>
<div class="flex flex-row justify-between w-full space-x-4 md:px-8">
    <Button secondary classes="w-1/2" onClick={handleMigrateClick}>{locale('actions.migrateAgain')}</Button>
    <Button autofocus classes="w-1/2" onClick={handleCloseClick}>{locale('actions.close')}</Button>
</div>
