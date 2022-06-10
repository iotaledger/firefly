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
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { onMount } from 'svelte'

    export let profileColor = 'blue'
    export let profileInitial = ''
    
    const isUpToDate = $versionDetails.upToDate

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)
    
    export let handleSettingsClick = (): void => {}

    const handleLogoutClick = async (): Promise<void> => {
        // @todo on desktop uses true as param, on mobile we get errors
        await logout()
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

<div class="flex flex-col flex-1 overflow-auto">
    <div class="grid justify-items-center w-full">
        <div
            class="w-16 h-16 flex items-center justify-center rounded-full leading-100"
            style="background-color: {profileColor};"
        >
            <span class="text-20 text-center text-white uppercase font-semibold">
                {profileInitial}
            </span>
        </div>
        <Text type="h4" unwrapped classes="mt-4">{$activeProfile?.name}</Text>
        {#if $activeProfile?.isDeveloperProfile}
            <Chip label={localize('general.dev')} />
        {/if}
        <button
            class="rounded-xl"
            on:click={handleLogoutClick}
        >
            <Icon width="16" height="16" classes="text-gray-500 -ml-2 -mt-5" icon="logout" />
            <Text type="p" classes="ml-1 -mt-5">
                {localize('views.dashboard.profileModal.logout')}
            </Text>
        </button>
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
</div>

<style lang="scss">
    button {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        grid-auto-flow: column;
        justify-items: start;
        align-items: center;
        place-content: space-between;
        padding: 1rem 1.25rem;
        margin: 0.40rem 0;
    }
    .profile-block {
        grid-template-columns: 1fr;
    }
</style>