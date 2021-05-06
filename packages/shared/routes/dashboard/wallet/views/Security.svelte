<script lang="typescript">
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor, isRecentDate } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isStrongholdLocked, profiles } from 'shared/lib/profile'
    import { LedgerStatus } from 'shared/lib/typings/wallet'
    import { api, profileType, ProfileType } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let backupSafe
    let color
    let isDestroyed = false
    let isCheckingLedger
    let ledgerDeviceStatus
    let hardwareDeviceMessage
    let isSoftwareAccountProfile = true

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

    function checkLedgerConnection() {
        return new Promise((resolve, reject) => {
            // TODO: ledger fix this
            api.getLedgerDeviceStatus($profileType === 'LedgerNanoSimulator', {
                onSuccess(response) {
                    ledgerDeviceStatus = response.payload.type
                    resolve()
                },
                onError(e) {
                    ledgerDeviceStatus = LedgerStatus.Disconnected
                    reject(e)
                },
            })
        })
    }

    function checkLedger() {
        isCheckingLedger = true
        const cb = () => {
            if (!isDestroyed) {
                setTimeout(checkLedger, 10000)
            }
        }
        checkLedgerConnection().then(cb).catch(cb)
    }

    $: {
        if (!isCheckingLedger && $profileType !== ProfileType.Software) {
            checkLedger()
        }
    }

    $: {
        switch (ledgerDeviceStatus) {
            case LedgerStatus.Connected:
                hardwareDeviceMessage = 'detected'
                break
            case LedgerStatus.Disconnected:
                hardwareDeviceMessage = 'noneDetected'
                break
            case LedgerStatus.Locked:
                hardwareDeviceMessage = 'locked'
                break
        }
    }

    $: isSoftwareAccountProfile = $profileType === ProfileType.Software

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(setup)
    onDestroy(() => {
        unsubscribe()
        isDestroyed = true
    })
</script>

<div data-label="security" class="pt-6 pb-8 px-8 flex-grow flex flex-col h-full">
    <Text type="h5" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-3 auto-rows-max w-full overflow-y-auto flex-auto h-1 -mr-2 pr-2 scroll-secondary">
        <!-- TODO: ledger, fix UI -->
        {#if isSoftwareAccountProfile}
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
            <!-- Firefly version -->
        {:else}
            <!-- Hardware Device -->
            <SecurityTile
                onClick={checkLedgerConnection}
                title={locale('views.dashboard.security.hardware_device.title')}
                message={locale(`views.dashboard.security.hardware_device.${hardwareDeviceMessage}`)}
                color="gray"
                icon="chip" />
        {/if}
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } })}
            message={locale(`views.dashboard.security.version.${$versionDetails.upToDate ? 'upToDate' : 'outOfDate'}`)}
            color={$versionDetails.upToDate ? 'blue' : 'yellow'}
            warning={!$versionDetails.upToDate}
            icon="firefly"
            onClick={() => handleSecurityTileClick('version')} />
        {#if isSoftwareAccountProfile}
            <!-- Stronghold status -->
            <SecurityTile
                title={locale('views.dashboard.security.strongholdStatus.title')}
                message={locale(`views.dashboard.security.strongholdStatus.${$isStrongholdLocked ? 'locked' : 'unlocked'}`)}
                color="yellow"
                icon={$isStrongholdLocked ? 'lock' : 'unlock'}
                onClick={() => ($isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold())}
                classes="col-span-2"
                toggle
                toggleActive={!$isStrongholdLocked} />
        {/if}
    </div>
</div>
