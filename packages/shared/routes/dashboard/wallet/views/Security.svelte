<script lang="typescript">
    import {
        getLedgerDeviceStatus,
        ledgerDeviceState,
        pollLedgerDeviceStatus,
        stopPollingLedgerStatus
    } from 'shared/lib/ledger'
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, isStrongholdLocked, profiles } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { LedgerDeviceState } from "shared/lib/typings/ledger";

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let backupSafe
    let color
    let isCheckingLedger
    let ledgerSpinnerTimeout
    let LEDGER_STATUS_POLL_INTERVAL = 5000

    let hardwareDeviceColor = 'gray'
    $: {
        switch($ledgerDeviceState) {
            default:
            case LedgerDeviceState.Connected:
                hardwareDeviceColor = 'blue'
                break
            case LedgerDeviceState.NotDetected:
                hardwareDeviceColor = 'red'
                break
            case LedgerDeviceState.AppNotOpen:
            case LedgerDeviceState.LegacyConnected:
            case LedgerDeviceState.Locked:
                hardwareDeviceColor = 'gray'
                break
        }
    }

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(() => {
        setup()

        if (!$isSoftwareProfile) {
            pollLedgerDeviceStatus(false, LEDGER_STATUS_POLL_INTERVAL, getLedgerDeviceStatus)
        }
    })

    onDestroy(() => {
        clearTimeout(ledgerSpinnerTimeout)
        stopPollingLedgerStatus()
        unsubscribe()
    })

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

    function syncLedgerDeviceStatus() {
        isCheckingLedger = true
        const _onComplete = () => (ledgerSpinnerTimeout = setTimeout(() => (isCheckingLedger = false), 500))
        getLedgerDeviceStatus(false, _onComplete, _onComplete, _onComplete)
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
                message={locale(`views.dashboard.security.hardwareDevice.statuses.${$ledgerDeviceState}`)}
                color={hardwareDeviceColor}
                keepDarkThemeIconColor
                icon="chip"
                onClick={syncLedgerDeviceStatus}
                refreshIcon
                loading={isCheckingLedger}
                classes="col-span-2"
                wide />
        {/if}
    </div>
</div>
