<script lang="typescript">
    import { formatDate, localize } from '@core/i18n'
    import { TextType } from 'shared/components/Text.svelte'
    import { Button, Logo, Text, ExportStrongholdButton } from 'shared/components'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { closePopup } from 'shared/lib/popup'

    export let lastBackupDate
    export let lastBackupDateFormatted

    const color = getBackupWarningColor(lastBackupDate)
    const busy = false

    function handleCancelClick(): void {
        closePopup()
    }
</script>

<div class="flex w-full flex-row flex-wrap">
    <Text type={TextType.h4} classes="mb-5">
        {lastBackupDate
            ? localize('popups.backup.title', {
                  values: { date: formatDate(lastBackupDate, { format: 'long' }) },
              })
            : localize('popups.backup.notBackedUp')}
    </Text>
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo="logo-stronghold" />
    </div>
    <div class="w-full text-center my-6 md:px-8">
        <Text overrideColor type={TextType.h5} classes="mb-2 text-{color}-600">
            {#if !lastBackupDate}
                {localize('popups.backup.notBackedUpDescription')}
            {:else}
                {localize('popups.backup.lastBackup', {
                    values: {
                        date: localize(`dates.${lastBackupDateFormatted.unit}`, {
                            values: { time: lastBackupDateFormatted.value },
                        }),
                    },
                })}
            {/if}
        </Text>
        <Text smaller secondary classes="mb-2">{localize('popups.backup.backupDescription')}</Text>
        <Text smaller secondary>{localize('popups.backup.backupWarning')}</Text>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button secondary classes="w-1/2" onClick={handleCancelClick} disabled={busy}>
            {localize('actions.cancel')}
        </Button>
        <ExportStrongholdButton showNotification classes="w-1/2" />
    </div>
</div>
