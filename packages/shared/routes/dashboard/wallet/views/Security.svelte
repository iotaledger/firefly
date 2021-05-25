<script lang="typescript">
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, isStrongholdLocked, profiles, ProfileType } from 'shared/lib/profile'
    import { LedgerStatus } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let backupSafe
    let color
    let isCheckingLedger
    let ledgerDeviceStatus
    let hardwareDeviceMessage
    let hardwareDeviceColor = 'gray'
    let interval

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(() => {
        setup()
        if (!$isSoftwareProfile) {
            getLedgerDeviceStatus()
            interval = setInterval(() => {
                getLedgerDeviceStatus()
            }, 10000)
        }
    })
    onDestroy(() => {
        unsubscribe()
        if (interval) {
            clearTimeout(interval)
        }
    })

    $: {
        switch (ledgerDeviceStatus) {
            case LedgerStatus.Connected:
                hardwareDeviceMessage = 'detected'
                hardwareDeviceColor = 'blue'
                break
            case LedgerStatus.Disconnected:
                hardwareDeviceMessage = 'noneDetected'
                hardwareDeviceColor = 'gray'
                break
            case LedgerStatus.Locked:
                hardwareDeviceMessage = 'locked'
                hardwareDeviceColor = 'gray'
                break
        }
    }

    function setup() {
        const ap = get(activeProfile)
        const lastStrongholdBackupTime = ap?.lastStrongholdBackupTime
        lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
        lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
        backupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
        color = getBackupWarningColor(lastBackupDate)
    }

    function handleSecurityTileClick(popupType) {
        openPopup({
            type: popupType,
            props: {
                currentVersion: $versionDetails.currentVersion,
                lastBackupDate,
                lastBackupDateFormatted,
                isStrongholdLocked: $isStrongholdLocked,
            },
        })
    }

    function lockStronghold() {
        api.lockStronghold({
            onSuccess() {},
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            },
        })
    }

    function getLedgerDeviceStatus() {
        isCheckingLedger = true
        api.getLedgerDeviceStatus($activeProfile?.profileType === ProfileType.LedgerSimulator, {
            onSuccess(response) {
                ledgerDeviceStatus = response.payload.type
                setTimeout(function () {
                    isCheckingLedger = false
                }, 500)
            },
            onError(e) {
                ledgerDeviceStatus = LedgerStatus.Disconnected
                setTimeout(function () {
                    isCheckingLedger = false
                }, 500)
            },
        })
    }
</script>

<div data-label="security" class="pt-6 pb-8 px-8 flex-grow flex flex-col h-full">
    <Text type="h5" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-3 auto-rows-max w-full overflow-y-auto flex-auto h-1 -mr-2 pr-2 scroll-secondary">
        {#if $isSoftwareProfile}
            <!-- Stronghold backup -->
            <SecurityTile
                title={locale('views.dashboard.security.strongholdBackup.title')}
                message={$activeProfile?.lastStrongholdBackupTime ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                          values: { time: lastBackupDateFormatted.value },
                      }) : locale('popups.backup.notBackedUp')}
                onClick={() => handleSecurityTileClick('backup')}
                icon="shield"
                warning={!backupSafe}
                {color} />
        {:else}
            <!-- Ledger profile backup -->
            <SecurityTile
                title={locale('views.dashboard.security.strongholdBackup.title')}
                message={''}
                icon="shield"
                color="gray"
                disabled />
        {/if}
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } })}
            message={locale(`views.dashboard.security.version.${$versionDetails.upToDate ? 'upToDate' : 'outOfDate'}`)}
            color={$versionDetails.upToDate ? 'blue' : 'yellow'}
            warning={!$versionDetails.upToDate}
            icon="firefly"
            onClick={() => handleSecurityTileClick('version')} />
        {#if $isSoftwareProfile}
            <!-- Stronghold status -->
            <SecurityTile
                title={locale('views.dashboard.security.strongholdStatus.title')}
                message={locale(`views.dashboard.security.strongholdStatus.${$isStrongholdLocked ? 'locked' : 'unlocked'}`)}
                color="yellow"
                icon={$isStrongholdLocked ? 'lock' : 'unlock'}
                onClick={() => ($isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold())}
                classes="col-span-2"
                toggle
                wide
                toggleActive={!$isStrongholdLocked} />
        {:else}
            <!-- Hardware Device -->
            <SecurityTile
                title={locale('views.dashboard.security.hardwareDevice.title')}
                message={hardwareDeviceMessage ? locale(`views.dashboard.security.hardwareDevice.${hardwareDeviceMessage}`) : ''}
                color={hardwareDeviceColor}
                keepDarkThemeIconColor
                icon="chip"
                onClick={getLedgerDeviceStatus}
                refreshIcon
                loading={isCheckingLedger}
                classes="col-span-2"
                wide />
        {/if}
    </div>
</div>
