<script lang="typescript">
    import { showAppNotification } from '@auxiliary/notification'
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { diffDates } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { Animation, Button, Text, TextType } from 'shared/components'
    import { profileRouter } from '../../../../../lib/routers'

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
        message = ''
        const handleExport = (password: string) => {
            isBusy = true
            message = localize('general.exportingStronghold')
            exportStronghold(password, handleExportStrongholdResponse)
        }
        $profileRouter.setNeedsUnlock(true, handleExport, true)
    }

    function handleExportStrongholdResponse(cancelled, error): void {
        setTimeout(
            () => {
                message = ''
            },
            cancelled ? 0 : 5000
        )
        isBusy = false
        if (!cancelled) {
            if (error) {
                message = localize('general.exportingStrongholdFailed')
                showAppNotification({
                    type: 'error',
                    message: localize(error),
                })
            } else {
                message = localize('general.exportingStrongholdSuccess')
                showAppNotification({
                    type: 'info',
                    message: localize('general.exportingStrongholdSuccess'),
                })
            }
        }
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
    <Button classes="w-full" disabled={isBusy} {isBusy} onClick={handleExportClick}>
        {localize('actions.saveBackup')}
    </Button>
</div>
