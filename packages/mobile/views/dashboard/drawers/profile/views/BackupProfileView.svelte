<script lang="typescript">
    import { localize } from '@core/i18n'
    import { diffDates } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { Animation, Button, Text, TextType } from 'shared/components'

    const isBusy = false

    const lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    const lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    const lastBackupDateFormatted = diffDates(lastBackupDate, new Date())

    const subHeaderText = $activeProfile?.lastStrongholdBackupTime
        ? localize('views.dashboard.profileModal.backup.lastBackup', {
              values: {
                  date: localize(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }),
              },
          })
        : localize('views.dashboard.profileModal.backup.notBackedUp')
</script>

<div class="flex flex-col h-full justify-between">
    <div class="flex flex-col overflow-y-auto h-full">
        <Animation animation="backup-desktop" />
        <div class="space-y-2">
            <Text type={TextType.h4}>{subHeaderText}</Text>
            <Text type={TextType.p} secondary>{localize('popups.backupStronghold.body')}</Text>
        </div>
    </div>
    <Button classes="w-full" disabled={isBusy} {isBusy}>
        {localize('actions.saveBackup')}
    </Button>
</div>
