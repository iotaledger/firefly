<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
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
        {#each lockScreenTimeoutOptions as option}
            <button
                class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                on:click={() => updateProfile('settings.lockScreenTimeout', option.value)}
                class:active={option?.value === $activeProfile?.settings.lockScreenTimeout}>
                <Text type="p" smaller>{option?.label}</Text>
            </button>
        {/each}
    </div>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.appLock.title')}</Text>
    <Text type="p" secondary classes="mb-5">{localize('views.settings.appLock.description')}</Text>
    <Dropdown
        onSelect={(option) => {
            updateProfile('settings.lockScreenTimeout', option.value)
        }}
        value={assignTimeoutOptionLabel($activeProfile?.settings.lockScreenTimeout)}
        items={lockScreenTimeoutOptions} />
{/if}
