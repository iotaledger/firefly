<script lang="ts">
    import { Radio, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import { activeProfile, DEFAULT_PERSISTED_PROFILE_OBJECT, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownItem } from '@core/utils'

    let selectedLockTimeout: number =
        $activeProfile?.settings?.lockScreenTimeoutInMinutes ??
        DEFAULT_PERSISTED_PROFILE_OBJECT.settings.lockScreenTimeoutInMinutes
    $: selectedLockTimeout, updateActiveProfileSettings({ lockScreenTimeoutInMinutes: selectedLockTimeout })

    function lockScreenTimeoutOptions(): IDropdownItem<number>[] {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time,
            label: assignTimeoutOptionLabel(time),
        }))
    }

    function assignTimeoutOptionLabel(timeInMinutes: number): string {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }
        return localize('times.minute', { values: { time: timeInMinutes } })
    }
</script>

<app-lock-view class="flex flex-col space-y-4 h-full">
    <Text type={TextType.p} secondary>{localize('views.settings.appLock.description')}</Text>
    {#each lockScreenTimeoutOptions() as option}
        <Radio value={option.value} bind:group={selectedLockTimeout} label={option.label} classes="p-2" />
    {/each}
</app-lock-view>
