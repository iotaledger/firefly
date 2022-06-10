<script lang="typescript">
    import { Chip, Icon, Text, Toggle } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        hasEverOpenedProfileModal,
        isStrongholdLocked,
    } from 'shared/lib/profile'
    import { openSettings } from '@core/router'
    import { api } from 'shared/lib/wallet'
    import { diffDates, getBackupWarningColor, getInitials, isRecentDate } from 'shared/lib/helpers'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { onMount } from 'svelte'

    const profileColor = 'blue' // TODO: each profile has a different color
    const isUpToDate = $versionDetails.upToDate

    $: profileName = $activeProfile?.name
    $: profileInitial = getInitials(profileName, 1)
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)
    
    const handleSettingsClick = (): void => {
        openSettings()
    }

    const handleLogoutClick = async (): Promise<void> => {
        await logout(true)
    }

    const handleStrongholdToggleClick = (): void => {
        if ($isStrongholdLocked) {
            openPopup({
                type: 'password',
                props: {
                    isStrongholdLocked: $isStrongholdLocked,
                },
            })
        } else {
            api.lockStronghold({
                onSuccess() {},
                onError(err) {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                },
            })
        }
    }

    function handleBackupClick() {
        openPopup({
            type: 'backup',
            props: {
                lastBackupDate,
                lastBackupDateFormatted,
            },
        })
    }

    function handleVersionUpdateClick() {
        openPopup({ type: 'version' })
    }

    onMount(() => {
        hasEverOpenedProfileModal.set(true)
    })
</script>

<div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
    <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
        <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
    </div>
    <div class="flex flex-row space-x-2">
        <Text>{profileName}</Text>
        {#if $activeProfile?.isDeveloperProfile}
            <Chip label={localize('general.dev')} />
        {/if}
    </div>
</div>

{#if !isUpToDate}
    <button 
        on:click={handleVersionUpdateClick}
        class="bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white"
    >
        <Icon icon="warning" classes="row-span-3 text-blue-500" />
        <Text type="p" unwrapped classes="col-span-6">
            {localize('views.dashboard.profileModal.version.title')}
        </Text>
        <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
            {localize('views.dashboard.profileModal.version.updateVersion', {
                values: { version: $versionDetails.newVersion },
            })}
        </Text>
        <Icon 
            width={18} 
            height={18} 
            icon="chevron-right" 
            classes="row-span-3 justify-self-end text-gray-500 dark:text-white"
        />
    </button>
{/if}
{#if !isBackupSafe}
    <button 
        on:click={handleBackupClick}
        class="bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white"
    >
        <Icon icon="warning" classes="row-span-3 text-{backupWarningColor}-500" />
        <Text type="p" unwrapped classes="col-span-3">
            {localize('views.dashboard.profileModal.backup.title')}
        </Text>
        <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
            {$activeProfile?.lastStrongholdBackupTime
                ? localize('views.dashboard.profileModal.backup.lastBackup', {
                        values: {
                            date: localize(`dates.${lastBackupDateFormatted.unit}`, {
                                values: { time: lastBackupDateFormatted.value },
                            }),
                        },
                    })
                : localize('views.dashboard.profileModal.backup.notBackedUp')}
        </Text>
        <Icon 
            width={18} 
            height={18} 
            icon="chevron-right" 
            classes="row-span-3 justify-self-end text-gray-500 dark:text-white"
        />
    </button>
{/if}
<button 
    on:click={handleStrongholdToggleClick}
    class="bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white"
>
    <Icon  
        icon="network"
        classes="row-span-3 text-blue-500"
    />
    <Text type="p" unwrapped classes="col-span-6">
        {localize('views.dashboard.network.status')}
    </Text>
    <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
        {localize('views.dashboard.network.networkOperational')}
    </Text>
    <Icon 
        width={18} 
        height={18} 
        icon="chevron-right" 
        classes="row-span-3 justify-self-end text-gray-500 dark:text-white"
    />
</button>
<button 
    on:click={handleStrongholdToggleClick}
    class="bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white"
>
    <Icon  
        icon={$isStrongholdLocked ? 'lock' : 'unlock'}
        classes="row-span-3 text-blue-500"
    />
    <Text type="p" unwrapped classes="col-span-6">
        {localize('views.dashboard.profileModal.stronghold.title')}
    </Text>
    <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
        {localize(
            `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
        )}
    </Text>
    <Toggle
        active={!$isStrongholdLocked}
        classes="row-span-3 justify-self-end"
    />
</button>
<button
    on:click={handleSettingsClick}
    class="bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white"
>
    <Icon icon="settings" classes="row-span-3 text-blue-500" />
    <Text type="p" unwrapped classes="col-span-4">
        {localize('views.dashboard.profileModal.allSettings.title')}
    </Text>
    <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
        {localize('views.dashboard.profileModal.allSettings.description')}
    </Text>
    <Icon 
        width={18} 
        height={18} 
        icon="chevron-right" 
        classes="row-span-3 justify-self-end text-gray-500 dark:text-white"
    />
</button>
<button
    on:click={() => handleLogoutClick()}
    class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
>
    <Icon icon="logout" classes="text-blue-500" />
    <Text smaller classes="group-hover:text-blue-500">{localize('views.dashboard.profileModal.logout')}</Text>
</button>

<style lang="scss">
    button {
        display: grid;
        grid-auto-flow: column;
        justify-items: start;
        align-items: center;
        place-content: space-between;
        padding: 1rem 1.25rem;
        margin: 0.40rem 0.75rem;
    }

</style>