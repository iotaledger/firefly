<script lang="typescript">
    import { get } from 'svelte/store'
    import { onMount, onDestroy } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { activeProfile, profiles } from 'shared/lib/profile'
    import { openPopup } from 'shared/lib/popup'
    import { api, accountType } from 'shared/lib/wallet'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { LedgerStatus } from 'shared/lib/typings/wallet'

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let color
    let strongholdStatusMessage
    let isDestroyed = false
    let isCheckingLedger
    let isLedgerConnected
    let hardwareDeviceMessage
    let isSoftwareAccountProfile = true

    function setup() {
        const { isStrongholdLocked, lastStrongholdBackupTime } = get(activeProfile)
        lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
        lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
        color = getBackupWarningColor(lastBackupDate)
        strongholdStatusMessage = isStrongholdLocked ? 'locked' : 'unlocked'
    }

    function handleSecurityTileClick(popupType) {
        openPopup({
            type: popupType,
            props: {
                currentVersion: $versionDetails.currentVersion,
                lastBackupDate,
                lastBackupDateFormatted,
                isStrongholdLocked: get(activeProfile).isStrongholdLocked,
            },
        })
    }

    function lockStronghold() {
        api.lockStronghold({
            onSuccess() { },
            onError(error) {
                console.error(error)
            },
        })
    }

    function checkLedgerConnection() {
        return new Promise((resolve, reject) => {
            api.getLedgerDeviceStatus($accountType.type === 'LedgerNanoSimulator', {
                onSuccess(response) {
                    isLedgerConnected = response.payload.type === LedgerStatus.Connected
                    resolve()
                },
                onError(e) {
                    isLedgerConnected = false
                    reject(e)
                }
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
        if (!isCheckingLedger && $accountType && $accountType.type.startsWith('Ledger')) {
            checkLedger()
        }
    }

    $: hardwareDeviceMessage = isLedgerConnected ? 'detected' : 'none_detected'

    $: isSoftwareAccountProfile = $accountType && $accountType.type === 'Stronghold'

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(setup)
    onDestroy(() => {
        unsubscribe()
        isDestroyed = true
    })
</script>

<div data-label="security" class="p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-2">
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } })}
            message={locale(`views.dashboard.security.version.${$versionDetails.upToDate ? 'up_to_date' : 'out_of_date'}`)}
            color={$versionDetails.upToDate ? 'green' : 'red'}
            icon="firefly"
            onClick={() => handleSecurityTileClick('version')} />
        <!-- Hardware Device -->
        <SecurityTile
            onClick={checkLedgerConnection}
            title={locale('views.dashboard.security.hardware_device.title')}
            message={locale(`views.dashboard.security.hardware_device.${hardwareDeviceMessage}`)}
            color="gray"
            icon="chip" />
        {#if isSoftwareAccountProfile}
        <!-- Stronghold status -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_status.title')}
            message={locale(`views.dashboard.security.stronghold_status.${strongholdStatusMessage}`)}
            color={$activeProfile.isStrongholdLocked ? 'blue' : 'red'}
            icon="lock"
            onClick={() => (get(activeProfile).isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold())} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={$activeProfile.lastStrongholdBackupTime ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }) : locale('popups.backup.not_backed_up')}
            onClick={() => handleSecurityTileClick('backup')}
            icon="shield"
            {color} />
        {/if}
    </div>
</div>