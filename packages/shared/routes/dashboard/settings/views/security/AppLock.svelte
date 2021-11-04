<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    function assignTimeoutOptionLabel(timeInMinutes) {
        if (timeInMinutes >= 60) {
            return localize('views.settings.appLock.durationHour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('views.settings.appLock.durationMinute', { values: { time: timeInMinutes } })
    }

    const lockScreenTimeoutOptions = [1, 5, 10, 30, 60].map((time) => ({
        value: time,
        label: assignTimeoutOptionLabel(time),
    }))
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.appLock.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
<Dropdown
    onSelect={(option) => {
        updateProfile('settings.lockScreenTimeout', option.value)
    }}
    value={assignTimeoutOptionLabel($activeProfile?.settings.lockScreenTimeout)}
    items={lockScreenTimeoutOptions} />
