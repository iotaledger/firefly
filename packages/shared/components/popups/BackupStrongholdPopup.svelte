<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Logo, Text, ExportStrongholdButton, TextType } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'

    const busy = false

    function handleCancelClick(): void {
        closePopup()
    }
</script>

<div class="flex w-full flex-col space-y-6">
    <Text type={TextType.h4}>
        {localize('popups.backupStronghold.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <div class="w-full p-10 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
            <Logo width="50%" logo="logo-stronghold" />
        </div>
        <div class="w-full">
            <Text type={TextType.p} color="gray-700">
                {localize('popups.backupStronghold.body')}
            </Text>
        </div>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button outline classes="w-1/2" onClick={handleCancelClick} disabled={busy}>
            {localize('actions.cancel')}
        </Button>
        <ExportStrongholdButton showNotification overrideTitle={localize('actions.backup')} classes="w-1/2" />
    </div>
</div>
