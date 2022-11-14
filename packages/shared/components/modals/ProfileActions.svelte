<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Button, ButtonSize, DeveloperIndicatorPill, HR, Icon, Modal, Text, Toggle } from 'shared/components'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { closePopup, openPopup, popupState } from '@auxiliary/popup'
    import { routerManager } from '@core/router'
    import { diffDates, getBackupWarningColor, getInitials, isRecentDate } from '@core/utils'
    import { appVersionDetails } from '@core/app'
    import { activeProfile, isActiveLedgerProfile, isSoftwareProfile, lockStronghold, logout } from '@core/profile'
    import { checkOrUnlockStronghold } from '@core/stronghold'

    export let modal: Modal = undefined

    const profileColor = 'blue' // TODO: each profile has a different color
    const isUpToDate = $appVersionDetails.upToDate

    const { isStrongholdLocked, shouldOpenProfileModal } = $activeProfile

    let ledgerConnectionText = ''

    $: profileName = $activeProfile?.name
    $: profileInitial = getInitials(profileName, 1)
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)
    // used to prevent the modal from closing when interacting with the password popup
    // to be able to see the stronghold toggle change
    $: isPasswordPopupOpen = $popupState?.active && $popupState?.type === 'password'
    $: if ($isActiveLedgerProfile && $ledgerConnectionState) {
        updateLedgerConnectionText()
    }

    function handleSettingsClick(): void {
        closePopup()
        $routerManager.openSettings()
        modal?.close()
    }

    function handleLogoutClick(): void {
        void logout()
    }

    function handleStrongholdToggleClick(): void {
        if ($isStrongholdLocked) {
            checkOrUnlockStronghold()
        } else {
            lockStronghold()
        }
    }

    function updateLedgerConnectionText(): void {
        ledgerConnectionText = localize(`views.dashboard.profileModal.hardware.statuses.${$ledgerConnectionState}`)
    }

    function handleBackupClick(): void {
        modal?.close()
        openPopup({
            type: 'backupStronghold',
        })
    }

    function handleVersionUpdateClick(): void {
        modal?.close()
        openPopup({ type: 'version' })
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
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <div class="flex flex-row items-center space-x-2">
                <Text>{profileName}</Text>
                {#if $activeProfile?.isDeveloperProfile}
                    <DeveloperIndicatorPill />
                {/if}
            </div>
            {#if $isActiveLedgerProfile}
                <Icon icon="ledger" classes="text-gray-900 dark:text-gray-100 w-4 h-4" />
            {/if}
        </div>
        <HR />
        {#if !isUpToDate}
            <div class="items-center p-3">
                <div class="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div class="flex flex-row items-center space-x-3">
                        <Icon icon="warning" boxed classes="text-blue-500" />
                        <div>
                            <Text type="p">{localize('views.dashboard.profileModal.version.title')}</Text>
                            <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
                                {localize('views.dashboard.profileModal.version.updateVersion', {
                                    values: { version: $appVersionDetails.newVersion },
                                })}
                            </Text>
                        </div>
                    </div>
                    <Button size={ButtonSize.Small} onClick={handleVersionUpdateClick}>
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
                            <Icon icon="warning" boxed classes="text-{backupWarningColor}-500" />
                            <div>
                                <Text type="p">{localize('views.dashboard.profileModal.backup.title')}</Text>
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
                            </div>
                        </div>
                        <Button outline size={ButtonSize.Small} onClick={handleBackupClick}>
                            {localize('views.dashboard.profileModal.backup.button')}
                        </Button>
                    </div>
                </div>
                <HR />
            {/if}
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <Icon
                        icon={$isStrongholdLocked ? 'lock' : 'unlock'}
                        boxed
                        classes="text-blue-500"
                        boxClasses="bg-blue-100 dark:bg-gray-800"
                    />
                    <div>
                        <Text type="p">{localize('views.dashboard.profileModal.stronghold.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">
                            {localize(
                                `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
                            )}
                        </Text>
                    </div>
                </div>
                <Toggle
                    active={$isStrongholdLocked}
                    onClick={() => handleStrongholdToggleClick()}
                    classes="cursor-pointer"
                />
            </div>
            <HR />
        {:else}
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <Icon
                        icon="chip"
                        boxed
                        classes={$ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
                            ? 'text-blue-500'
                            : 'text-gray-500 dark:text-white'}
                        boxClasses={$ledgerConnectionState === LedgerConnectionState.CorrectAppOpen
                            ? 'bg-blue-100 dark:bg-gray-800'
                            : 'bg-gray-100 dark:bg-gray-800'}
                    />
                    <div>
                        <Text type="p">{localize('views.dashboard.profileModal.hardware.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-0.5">{ledgerConnectionText}</Text>
                    </div>
                </div>
            </div>
            <HR />
        {/if}
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="settings" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('views.dashboard.profileModal.allSettings')}
            </Text>
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row space-x-3 justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="logout" classes="text-gray-500 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
