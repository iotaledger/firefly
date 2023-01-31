<script lang="ts">
    import { localize } from '@core/i18n'
    import { diffDates, getBackupWarningColor } from '@core/utils'
    import { activeProfile } from '@core/profile'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'
    import { ProfileActionButton } from '..'

    export let lastBackupDate: Date
    export let onClick: () => unknown

    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)

    const secondaryText = $activeProfile?.lastStrongholdBackupTime
        ? localize('views.dashboard.profileModal.backup.lastBackup', {
              values: {
                  date: localize(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }),
              },
          })
        : localize('views.dashboard.profileModal.backup.notBackedUp')
</script>

<ProfileActionButton
    primaryText={localize('views.dashboard.profileModal.backup.title')}
    {secondaryText}
    icon={IconTypes.Warning}
    iconColor="{backupWarningColor}-500"
    color="{backupWarningColor}-500"
    {onClick}
/>
