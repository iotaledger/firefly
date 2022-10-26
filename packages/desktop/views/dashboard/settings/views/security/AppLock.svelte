<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { DropdownChoice } from '@core/utils'

    function updateLockTimeout(option): void {
        updateActiveProfileSettings({ lockScreenTimeoutInMinutes: option.value })
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('times.minute', { values: { time: timeInMinutes } })
    }

    function lockScreenTimeoutOptions(): DropdownChoice[] {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time,
            label: assignTimeoutOptionLabel(time),
        }))
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.appLock.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
<Dropdown
    onSelect={updateLockTimeout}
    value={assignTimeoutOptionLabel($activeProfile?.settings.lockScreenTimeoutInMinutes)}
    items={lockScreenTimeoutOptions()}
/>
