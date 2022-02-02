<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    function updateLockTimeout(option) {
        updateProfile('settings.lockScreenTimeout', option.value)
    }

    function assignTimeoutOptionLabel(timeInMinutes) {
        if (timeInMinutes >= 60) {
            return localize('times.hour', { values: { time: timeInMinutes / 60 } })
        }

        return localize('times.minute', { values: { time: timeInMinutes } })
    }

    function lockScreenTimeoutOptions() {
        return [1, 5, 10, 30, 60].map((time) => ({
            value: time,
            label: assignTimeoutOptionLabel(time),
        }))
    }

    const lockOptions = lockScreenTimeoutOptions()
</script>

<style type="text/scss">
    button {
        &.active {
            @apply bg-blue-500;
            @apply bg-opacity-10;
            :global(p) {
                @apply text-blue-500;
            }
        }
    }
</style>

{#if $mobile}
    <Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
    <div class="flex flex-col flex-wrap space-y-2 overflow-y-auto">
        {#each lockOptions as option}
            <button
                class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                on:click={() => updateLockTimeout(option)}
                class:active={option?.value === $activeProfile?.settings.lockScreenTimeout}>
                <Text type="p" smaller>{option?.label}</Text>
            </button>
        {/each}
    </div>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.appLock.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
    <Dropdown
        onSelect={updateLockTimeout}
        value={assignTimeoutOptionLabel($activeProfile?.settings.lockScreenTimeout)}
        items={lockOptions} />
{/if}
