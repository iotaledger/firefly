<script lang="typescript">
    import { get } from 'svelte/store'
    import { onMount, onDestroy } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { activeProfile, profiles } from 'shared/lib/profile'
    import { openPopup } from 'shared/lib/popup'
    import { api, wallet } from 'shared/lib/wallet'
    import { versionDetails } from 'shared/lib/appUpdater'

    const { accounts } = $wallet

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let color
    let strongholdStatusMessage
    let isDestroyed = false
    let isCheckingLedger
    let isLedgerOpened
    let hardwareDeviceMessage

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

    function checkLedger(simulator) {
        isCheckingLedger = true
        api.openLedgerApp(simulator, {
            onSuccess() {
                isLedgerOpened = true
                if (!isDestroyed) {
                    setTimeout(() => checkLedger(simulator), 10000)
                }
            },
            onError() {
                isLedgerOpened = false
                if (!isDestroyed) {
                    setTimeout(() => checkLedger(simulator), 10000)
                }
            }
        })
    }

    $: {
        if (!isCheckingLedger && $accounts.length > 0 && $accounts[0].signerType.type.startsWith('Ledger')) {
            checkLedger($accounts[0].signerType.type === 'LedgerNanoSimulator')
        }
    }

    $: hardwareDeviceMessage = isLedgerOpened ? 'detected' : 'none_detected'

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
            title={locale('views.dashboard.security.hardware_device.title')}
            message={locale(`views.dashboard.security.hardware_device.${hardwareDeviceMessage}`)}
            color="gray"
            icon="chip"
            classes="pointer-events-none" />
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
    </div>
</div>