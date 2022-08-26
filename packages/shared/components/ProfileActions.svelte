<script lang="typescript">
    import { Chip, Icon, Text, Toggle } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { NETWORK_HEALTH_COLORS, networkStatus } from 'shared/lib/networkStatus'
    import { NetworkStatusHealthText } from 'shared/lib/typings/network'
    import { onDestroy } from 'svelte'

    export let profileColor = 'blue'
    export let profileInitial = ''
    export let handleSettingsClick = (): void => {}

    const isUpToDate = $versionDetails.upToDate

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)

    $: healthStatusColor = NETWORK_HEALTH_COLORS[$networkStatus?.health ?? 0]
    $: healthStatusText = $networkStatus.healthText ?? NetworkStatusHealthText.Down

    async function handleLogoutClick(): Promise<void> {
        // @todo on desktop uses true as param, on mobile we get errors
        await logout()
    }

    function handleNetworkStatusClick(): void {
        openPopup({
            type: 'networkStatus',
        })
    }

    function handleStrongholdToggleClick(): void {
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

    function handleBackupClick(): void {
        openPopup({
            type: 'backup',
            props: {
                lastBackupDate,
                lastBackupDateFormatted,
            },
        })
    }

    function handleVersionUpdateClick(): void {
        openPopup({ type: 'version' })
    }
</script>

<div class="flex flex-col">
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
        <button class="rounded-xl py-2 pl-2 pr-3 mb-6 flex justify-center" on:click={handleLogoutClick}>
            <Icon width="16" height="16" classes="text-blue-500 mt-0.5 mr-1" icon="logout" />
            <Text type="p" overrideColor classes="text-blue-500">
                {localize('views.dashboard.profileModal.logout')}
            </Text>
        </button>
    </div>
    {#if !isUpToDate}
        <button
            on:click={handleVersionUpdateClick}
            class="main-button bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 ring-gray-300 rounded-xl border-solid"
        >
            <Icon icon="warning" classes="row-span-3 text-blue-500" />
            <Text type="h5" unwrapped classes="text-left col-span-6" fontWeight="font-600">
                {localize('views.dashboard.profileModal.version.title')}
            </Text>
            <Text type="h5" classes="text-left" color="gray-600" darkColor="gray-500" fontWeight="font-400">
                {localize('views.dashboard.profileModal.version.updateVersion', {
                    values: { version: $versionDetails.newVersion },
                })}
            </Text>
            <Icon
                width={18}
                height={18}
                icon="chevron-right"
                classes="row-span-3 justify-self-end text-gray-600 dark:text-white"
            />
        </button>
    {/if}
    <button
        on:click={handleBackupClick}
        class="main-button bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 rounded-xl border-solid ring-1 ring-gray-300 dark:ring-opacity-30"
    >
        <Icon icon="warning-filled" classes="row-span-3 text-{backupWarningColor}-500" />
        <Text type="h5" unwrapped classes="text-left col-span-3" fontWeight="font-600">
            {localize('views.dashboard.profileModal.backup.title')}
        </Text>
        <Text type="h5" classes="text-left" color="gray-600" darkColor="gray-500" fontWeight="font-400">
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
            classes="row-span-3 justify-self-end text-gray-600 dark:text-white"
        />
    </button>
    <button
        on:click={handleNetworkStatusClick}
        class="main-button bg-{healthStatusColor}-50 dark:bg-{healthStatusColor}-500 dark:bg-opacity-10 rounded-xl border-solid border-white ring-1 ring-gray-300 dark:ring-opacity-30"
    >
        <Icon icon="network" classes="row-span-3 text-{healthStatusColor}-500" />
        <Text type="h5" unwrapped classes="text-left col-span-6" fontWeight="font-600">
            {localize('views.dashboard.network.status')}
        </Text>
        <Text type="h5" classes="text-left" color="gray-600" darkColor="gray-500" fontWeight="font-400">
            {localize(`views.dashboard.network.${healthStatusText}`)}
        </Text>
        <Icon
            width={18}
            height={18}
            icon="chevron-right"
            classes="row-span-3 justify-self-end text-gray-600 dark:text-white"
        />
    </button>
    <button
        on:click={handleStrongholdToggleClick}
        class="main-button bg-gray-50 dark:bg-gray-500 dark:bg-opacity-10 rounded-xl border-solid border-white ring-1 ring-gray-300 dark:ring-opacity-30"
    >
        <Icon icon={$isStrongholdLocked ? 'lock' : 'unlock'} classes="row-span-3 text-blue-500" />
        <Text type="h5" unwrapped classes="text-left col-span-6" fontWeight="font-600">
            {localize('views.dashboard.profileModal.stronghold.title')}
        </Text>
        <Text type="h5" classes="text-left" color="gray-600" darkColor="gray-500" fontWeight="font-400">
            {localize(`views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`)}
        </Text>
        <Toggle active={!$isStrongholdLocked} classes="row-span-3 justify-self-end" />
    </button>
    <button
        on:click={handleSettingsClick}
        class="main-button bg-white dark:bg-gray-400 dark:bg-opacity-10 rounded-xl border-solid border-white ring-1 ring-gray-300 dark:ring-opacity-30"
    >
        <Icon icon="settings" classes="row-span-3 text-blue-500" />
        <Text type="h5" unwrapped classes="text-left col-span-4" fontWeight="font-600">
            {localize('views.dashboard.profileModal.allSettings.title')}
        </Text>
        <Text type="h5" classes="text-left" color="gray-600" darkColor="gray-500" fontWeight="font-400">
            {localize('views.dashboard.profileModal.allSettings.description')}
        </Text>
        <Icon
            width={18}
            height={18}
            icon="chevron-right"
            classes="row-span-3 justify-self-end text-gray-600 dark:text-white"
        />
    </button>
</div>

<style lang="scss">
    .main-button {
        display: grid;
        grid-template-columns: 1fr 4fr 1fr;
        grid-auto-flow: column;
        justify-items: start;
        align-items: center;
        place-content: space-between;
        padding: 1rem 1.25rem;
        margin: 0.4rem 0;
    }
    .profile-block {
        grid-template-columns: 1fr;
    }
</style>
