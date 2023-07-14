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
        HR,
        Icon,
        Modal,
        ProfilePicture,
        Text,
        TextType,
        Toggle,
        BoxedIcon,
    } from '@ui'
    import { fade } from 'svelte/transition'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let modal: Modal = undefined

    const isUpToDate = $appVersionDetails.upToDate

    const { isStrongholdLocked, shouldOpenProfileModal } = $activeProfile

    let ledgerConnectionText = ''

    $: profileName = $activeProfile?.name
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)
    // used to prevent the modal from closing when interacting with the password popup
    // to be able to see the stronghold toggle change
    $: isPasswordPopupOpen = $popupState?.active && $popupState?.id === 'password'
    $: if ($isActiveLedgerProfile && $ledgerConnectionState) {
        updateLedgerConnectionText()
    }

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
</script>

<Modal
    bind:this={modal}
    position={{ bottom: '16px', left: '80px' }}
    classes="w-80"
    on:open={() => shouldOpenProfileModal.set(true)}
    disableOnClickOutside={isPasswordPopupOpen}
>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <ProfilePicture profile={$activeProfile} size="small" />
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
        <HR />
        {#if !isUpToDate}
            <div class="items-center p-3">
                <div class="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div class="flex flex-row items-center space-x-3">
                        <BoxedIcon icon={IconEnum.Warning} classes="text-blue-500" />
                        <div>
                            <Text type={TextType.p}>{localize('views.dashboard.profileModal.version.title')}</Text>
                            <Text type={TextType.p} overrideColor classes="text-gray-500 -mt-0.5">
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
            <HR />
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
                                <Text type={TextType.p}>{localize('views.dashboard.profileModal.backup.title')}</Text>
                                <Text type={TextType.p} overrideColor classes="text-gray-500 -mt-0.5">
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
                            </div>
                        </div>
                        <Button outline size={ButtonSize.Small} onClick={onBackupClick}>
                            {localize('views.dashboard.profileModal.backup.button')}
                        </Button>
                    </div>
                </div>
                <HR />
            {/if}
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <BoxedIcon
                        icon={$isStrongholdLocked ? IconEnum.Lock : IconEnum.Unlock}
                        classes="text-blue-500"
                        boxClasses="bg-blue-100 dark:bg-gray-800"
                    />
                    <div>
                        <Text type={TextType.p}>{localize('views.dashboard.profileModal.stronghold.title')}</Text>
                        <Text type={TextType.p} overrideColor classes="text-gray-500 -mt-0.5">
                            {localize(
                                `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
                            )}
                        </Text>
                    </div>
                </div>
                <Toggle active={$isStrongholdLocked} onClick={onStrongholdToggleClick} />
            </div>
            <HR />
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
                        <Text type={TextType.p}>{localize('views.dashboard.profileModal.hardware.title')}</Text>
                        <Text type={TextType.p} overrideColor classes="text-gray-500 -mt-0.5"
                            >{ledgerConnectionText}</Text
                        >
                    </div>
                </div>
            </div>
            <HR />
        {/if}
        <button
            on:click={() => onSettingsClick()}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={IconEnum.Settings} classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('views.dashboard.profileModal.allSettings')}
            </Text>
        </button>
        <button
            on:click={() => onLogoutClick()}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon={IconEnum.Logout} classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
