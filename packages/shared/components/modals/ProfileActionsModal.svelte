<script lang="ts">
    import { PopupId, closePopup, openPopup, popupState } from '@auxiliary/popup'
    import { appVersionDetails } from '@core/app'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile, lockStronghold, logout } from '@core/profile'
    import { routerManager } from '@core/router'
    import { checkOrUnlockStronghold } from '@core/stronghold'
    import { diffDates, getBackupWarningColor, isRecentDate } from '@core/utils'
    import {
        Button,
        ButtonSize,
        DeveloperIndicatorPill,
        Icon,
        Modal,
        ProfilePicture,
        Text,
        Toggle,
        Size,
        BoxedIcon,
    } from '@ui'
    import { fade } from 'svelte/transition'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let modal: Modal | undefined

    let ledgerConnectionText = ''

    $: profileName = $activeProfile?.name
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)
    // used to prevent the modal from closing when interacting with the password popup
    // to be able to see the stronghold toggle change
    $: isPasswordPopupOpen = $popupState?.active && $popupState?.id === PopupId.UnlockStronghold
    $: if ($isActiveLedgerProfile && $ledgerConnectionState) {
        updateLedgerConnectionText()
    }

    const isUpToDate = $appVersionDetails.upToDate
    const { isStrongholdLocked, shouldOpenProfileModal } = $activeProfile
    const ACTION_BUTTONS: { icon: IconEnum; label: string; onClick: () => void }[] = [
        {
            label: localize('views.dashboard.profileModal.allSettings'),
            icon: IconEnum.Settings,
            onClick: onSettingsClick,
        },
        {
            label: localize('views.dashboard.profileModal.logout'),
            icon: IconEnum.Logout,
            onClick: onLogoutClick,
        },
    ]

    function onSettingsClick(): void {
        closePopup()
        $routerManager.openSettings()
        modal?.close()
    }

    function onLogoutClick(): void {
        void logout()
    }

    function onStrongholdToggleClick(): void {
        if ($isStrongholdLocked) {
            checkOrUnlockStronghold()
        } else {
            lockStronghold()
        }
    }

    function updateLedgerConnectionText(): void {
        ledgerConnectionText = localize(`views.dashboard.profileModal.hardware.statuses.${$ledgerConnectionState}`)
    }

    function onBackupClick(): void {
        modal?.close()
        openPopup({
            id: PopupId.BackupStronghold,
        })
    }

    function onVersionUpdateCheckClick(): void {
        modal?.close()
        openPopup({ id: PopupId.CheckForUpdates })
    }

    function openProfileModal(): void {
        shouldOpenProfileModal.set(true)
    }
</script>

<Modal
    bind:this={modal}
    position={{ bottom: '16px', left: '80px' }}
    classes="w-80"
    on:open={openProfileModal}
    disableOnClickOutside={isPasswordPopupOpen}
>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <ProfilePicture profile={$activeProfile} size={Size.Small} />
            <div class="flex flex-row items-center space-x-2">
                <Text>{profileName}</Text>
                {#if $activeProfile?.isDeveloperProfile}
                    <DeveloperIndicatorPill />
                {/if}
            </div>
            {#if $isActiveLedgerProfile}
                <Icon icon={IconEnum.Ledger} classes="text-gray-900 dark:text-gray-100 w-4 h-4" />
            {/if}
        </div>
        <hr />
        {#if !isUpToDate}
            <div class="items-center p-3">
                <div class="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div class="flex flex-row items-center space-x-3">
                        <BoxedIcon icon={IconEnum.Warning} classes="text-blue-500" />
                        <div>
                            <Text>{localize('views.dashboard.profileModal.version.title')}</Text>
                            <Text overrideColor classes="text-gray-500 -mt-0.5">
                                {localize('views.dashboard.profileModal.version.updateVersion', {
                                    values: { version: $appVersionDetails.newVersion },
                                })}
                            </Text>
                        </div>
                    </div>
                    <Button size={ButtonSize.Small} onClick={onVersionUpdateCheckClick}>
                        {localize('views.dashboard.profileModal.version.button')}
                    </Button>
                </div>
            </div>
            <hr />
        {/if}

        {#if $isSoftwareProfile}
            {#if !isBackupSafe}
                <div class="items-center p-3">
                    <div
                        class="flex items-center justify-between bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 p-3 rounded-lg"
                    >
                        <div class="flex flex-row items-center space-x-3">
                            <BoxedIcon icon={IconEnum.Warning} classes="text-{backupWarningColor}-500" />
                            <div>
                                <Text>{localize('views.dashboard.profileModal.backup.title')}</Text>
                                <Text overrideColor classes="text-gray-500 -mt-0.5">
                                    {$activeProfile?.lastStrongholdBackupTime
                                        ? localize('views.dashboard.profileModal.backup.lastBackup', {
                                              values: {
                                                  date: localize(`dates.${lastBackupDateFormatted?.unit}`, {
                                                      values: { time: lastBackupDateFormatted?.value },
                                                  }),
                                              },
                                          })
                                        : localize('views.dashboard.profileModal.backup.notBackedUp')}
                                </Text>
                            </div>
                        </div>
                        <Button outline size={ButtonSize.Small} onClick={onBackupClick}>
                            {localize('views.dashboard.profileModal.backup.button')}
                        </Button>
                    </div>
                </div>
                <hr />
            {/if}
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <BoxedIcon
                        icon={$isStrongholdLocked ? IconEnum.Lock : IconEnum.Unlock}
                        classes="text-blue-500"
                        boxClasses="bg-blue-100 dark:bg-gray-800"
                    />
                    <div>
                        <Text>{localize('views.dashboard.profileModal.stronghold.title')}</Text>
                        <Text overrideColor classes="text-gray-500 -mt-0.5">
                            {localize(
                                `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
                            )}
                        </Text>
                    </div>
                </div>
                <Toggle active={$isStrongholdLocked} onClick={onStrongholdToggleClick} />
            </div>
            <hr />
        {:else}
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <BoxedIcon
                        boxClasses={$ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
                            ? 'bg-blue-100 dark:bg-gray-800'
                            : 'bg-gray-100 dark:bg-gray-800'}
                        icon={IconEnum.Chip}
                        classes={$ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
                            ? 'text-blue-500'
                            : 'text-gray-500 dark:text-white'}
                    />
                    <div>
                        <Text>{localize('views.dashboard.profileModal.hardware.title')}</Text>
                        <Text overrideColor classes="text-gray-500 -mt-0.5">{ledgerConnectionText}</Text>
                    </div>
                </div>
            </div>
            <hr />
        {/if}

        {#each ACTION_BUTTONS as { onClick, icon, label }}
            <button
                on:click={onClick}
                class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
            >
                <Icon {icon} classes="text-gray-500 group-hover:text-blue-500" />
                <Text smaller classes="group-hover:text-blue-500">
                    {label}
                </Text>
            </button>
        {/each}
    </profile-modal-content>
</Modal>
