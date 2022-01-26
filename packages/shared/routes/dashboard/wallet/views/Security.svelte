<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { getLedgerDeviceStatus, getLedgerOpenedApp, ledgerDeviceState } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile, isStrongholdLocked, profiles } from 'shared/lib/profile'
    import { LedgerApp, LedgerAppName, LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { api } from 'shared/lib/wallet'
    import type { Locale, LocaleArgs } from 'shared/lib/typings/i18n'
    import type { DateDiff } from 'shared/lib/typings/wallet';

    export let locale: Locale

    let lastBackupDate: Date
    let lastBackupDateFormatted: DateDiff
    let backupSafe: Date
    let color: string
    let isCheckingLedger: boolean
    let ledgerSpinnerTimeout: NodeJS.Timeout
    let hardwareDeviceColor = 'gray'
    let hardwareDeviceStatus: string

    $: {
        switch ($ledgerDeviceState) {
            default:
            case LedgerDeviceState.Connected:
                hardwareDeviceColor = 'blue'
                break
            case LedgerDeviceState.NotDetected:
            case LedgerDeviceState.AppNotOpen:
            case LedgerDeviceState.LegacyConnected:
            case LedgerDeviceState.Locked:
            case LedgerDeviceState.OtherConnected:
                hardwareDeviceColor = 'red'
                break
        }
    }
    $: checkHardwareDeviceStatus($ledgerDeviceState)
    $: setup(), profiles // Runs setup when profiles changes


    onMount(() => {
        setup()
    })

    onDestroy(() => {
        clearTimeout(ledgerSpinnerTimeout)
    })

    function setup() {
        const lastStrongholdBackupTime = $activeProfile.lastStrongholdBackupTime
        lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
        lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
        backupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth
        color = getBackupWarningColor(lastBackupDate)
    }

    function checkHardwareDeviceStatus(state: LedgerDeviceState): void {
        const values: LocaleArgs = state === LedgerDeviceState.LegacyConnected ? { legacy: LedgerAppName.IOTALegacy } : {}
        const text = locale(`views.dashboard.security.hardwareDevice.statuses.${state}`, { values })

        /**
         * NOTE: The text for when another app (besides IOTA or IOTA Legacy) is open
         * requires an app name to be prepended or else the text won't make sense.
         */
        if (state === LedgerDeviceState.OtherConnected) {
            getLedgerOpenedApp()
                .then((la: LedgerApp) => {
                    hardwareDeviceStatus = `${la.name} ${text}`
                })
                .catch((err) => {
                    ledgerDeviceState.set(LedgerDeviceState.NotDetected)

                    console.error(err)
                })
        } else {
            hardwareDeviceStatus = text
        }
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
                onClick={() => $isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold()}
                classes="col-span-2"
                toggle
                wide
                toggleActive={!$isStrongholdLocked} />
        {:else}
            <!-- Hardware Device -->
            <SecurityTile
                title={locale('views.dashboard.security.hardwareDevice.title')}
                message={hardwareDeviceStatus}
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
