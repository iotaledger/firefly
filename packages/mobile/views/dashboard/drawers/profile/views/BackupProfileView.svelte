<script lang="ts">
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { diffDates } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { Animation, Button, Text, TextType } from '@ui'
    import { profileRouter } from '@/routers'

    let isBusy = false
    let message = ''

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())

    $: subHeaderText = $activeProfile?.lastStrongholdBackupTime
        ? localize('views.dashboard.profileModal.backup.lastBackup', {
              values: {
                  date: localize(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }),
              },
          })
        : localize('views.dashboard.profileModal.backup.notBackedUp')

    function handleExportClick(): void {
        isBusy = false
        const handleExport = (password: string) => {
            isBusy = true
            message = localize('general.exportingStronghold')
            exportStronghold(password, handleExportStronghold)
        }
        $profileRouter.setNeedsUnlock(true, handleExport, true)
    }
    function handleExportStronghold(cancelled, error) {
        $profileRouter.handleExportResult(cancelled, error)
        if (error) {
            message = localize('general.exportingStrongholdFailed')
        } else {
            message = ''
        }
        isBusy = false
    }
</script>

<div class="flex flex-col h-full justify-between">
    <div class="flex flex-col h-full">
        <Animation animation="backup-desktop" />
        <div class="space-y-2">
            <Text type={TextType.h4}>{subHeaderText}</Text>
            <Text type={TextType.p} secondary>{localize('popups.backupStronghold.body')}</Text>
        </div>
    </div>
    <Button classes="w-full" disabled={isBusy} busyMessage={message} {isBusy} onClick={handleExportClick}>
        {localize('actions.saveBackup')}
    </Button>
</div>
