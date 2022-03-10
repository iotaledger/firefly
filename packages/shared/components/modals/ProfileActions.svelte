<script lang="typescript">
    import { Button, HR, Icon, Modal, Text, Toggle } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { getLedgerDeviceStatus, getLedgerOpenedApp, ledgerDeviceState } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile, isStrongholdLocked } from 'shared/lib/profile'
    import { openSettings } from 'shared/lib/router'
    import { LocaleArgs } from 'shared/lib/typings/i18n'
    import { LedgerApp, LedgerAppName, LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { api } from 'shared/lib/wallet'
    import { diffDates, getBackupWarningColor, getInitials, isRecentDate } from 'shared/lib/helpers'
    import { fade } from 'svelte/transition'

    export let isActive: boolean

    const profileColor = 'blue' // TODO: each profile has a different color

    let isLedgerConnected = false
    let isCheckingLedger = false
    let ledgerConnectionText = ''

    $: profileName = $activeProfile?.name
    $: profileInitial = getInitials(profileName, 1)
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
    $: backupWarningColor = getBackupWarningColor(lastBackupDate)

    $: if ($isLedgerProfile && $ledgerDeviceState) {
        updateLedgerConnectionText()
        isLedgerConnected = $ledgerDeviceState === LedgerDeviceState.Connected
    }

    const handleSettingsClick = (): void => {
        openSettings()
        isActive = false
    }

    const handleLogoutClick = async (): Promise<void> => {
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

    const syncLedgerDeviceStatus = (): void => {
        isCheckingLedger = true
        const _onComplete = () => setTimeout(() => (isCheckingLedger = false), 500)
        getLedgerDeviceStatus(false, _onComplete, _onComplete, _onComplete)
    }

    const updateLedgerConnectionText = (): void => {
        const values: LocaleArgs =
            $ledgerDeviceState === LedgerDeviceState.LegacyConnected ? { legacy: LedgerAppName.IOTALegacy } : {}
        const text = localize(`views.dashboard.profileModal.hardware.statuses.${$ledgerDeviceState}`, { values })

        /**
         * NOTE: The text for when another app (besides IOTA or IOTA Legacy) is open
         * requires an app name to be prepended or else the text won't make sense.
         */
        if ($ledgerDeviceState === LedgerDeviceState.OtherConnected) {
            getLedgerOpenedApp()
                .then((la: LedgerApp) => {
                    ledgerConnectionText = `${la.name} ${text}`
                })
                .catch((err) => {
                    ledgerDeviceState.set(LedgerDeviceState.NotDetected)
                    console.error(err)
                })
        } else {
            ledgerConnectionText = text
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
</script>

<Modal bind:isActive position={{ bottom: '16px', left: '80px' }} classes="w-80">
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <Text>{profileName}</Text>
            {#if $isLedgerProfile}
                <Icon icon="ledger" classes="text-gray-500 w-4 h-4" />
            {/if}
        </div>
        <HR />
        {#if $isSoftwareProfile}
            <HR />
            <div class="items-center p-3">
                <div class="flex items-center justify-between bg-{backupWarningColor}-100 p-3 rounded">
                    <Icon icon={isBackupSafe ? 'shield' : 'warning'} boxed classes="text-{backupWarningColor}-500" />
                    <div class="ml-2 mr-auto">
                        <Text type="p">{localize('views.dashboard.profileModal.backup.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-1">
                            {$activeProfile?.lastStrongholdBackupTime
                                ? localize(`dates.${lastBackupDateFormatted?.unit}`, {
                                      values: { time: lastBackupDateFormatted?.value },
                                  })
                                : localize('popups.backup.notBackedUp')}
                        </Text>
                    </div>
                    <Button secondary xsmall onClick={handleBackupClick}>
                        <Text type="p">{localize('views.dashboard.profileModal.backup.button')}</Text>
                    </Button>
                </div>
            </div>
            {#if !isBackupSafe}
                <div class="items-center p-3">
                    <div
                        class="flex items-center space-x-2 justify-between bg-{backupWarningColor}-50 dark:bg-{backupWarningColor}-500 dark:bg-opacity-10 p-3 rounded"
                    >
                        <Icon icon="warning" boxed classes="text-{backupWarningColor}-500" />
                        <div>
                            <Text type="p">{localize('views.dashboard.profileModal.backup.title')}</Text>
                            <Text type="p" overrideColor classes="text-gray-500">
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
                        <Button secondary xsmall onClick={handleBackupClick}>
                            <Text type="p">{localize('views.dashboard.profileModal.backup.button')}</Text>
                        </Button>
                    </div>
                </div>
                <HR />
            {/if}
            <div class="flex justify-between items-center p-3">
                <div class="flex items-center">
                    <Icon
                        icon={$isStrongholdLocked ? 'lock' : 'unlock'}
                        boxed
                        classes="text-blue-500"
                        boxClasses="bg-blue-100 mr-3"
                    />
                    <div>
                        <Text type="p">{localize('views.dashboard.profileModal.stronghold.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-1">
                            {localize(
                                `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
                            )}
                        </Text>
                    </div>
                </div>
                <Toggle active={!$isStrongholdLocked} onClick={handleStrongholdToggleClick} classes="cursor-pointer" />
            </div>
            <HR />
            <div class="flex justify-between items-center p-3">
                <div class="flex flex-row items-center space-x-3">
                    <Icon
                        icon="chip"
                        boxed
                        classes={isLedgerConnected ? 'text-blue-500' : 'text-gray-500 dark:text-white'}
                        boxClasses={isLedgerConnected ? 'bg-blue-100 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'}
                    />
                    <div>
                        <Text type="p">{localize('views.dashboard.profileModal.hardware.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-1">
                            {ledgerConnectionText}
                        </Text>
                    </div>
                </div>
                <button on:click={syncLedgerDeviceStatus}>
                    <Icon
                        icon="refresh"
                        classes="{isCheckingLedger &&
                            'animate-spin-reverse'} text-gray-500 dark:text-white cursor-pointer"
                    />
                </button>
            </div>
        {/if}
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="settings" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">
                {localize('views.dashboard.profileModal.allSettings')}
            </Text>
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="logout" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{localize('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
