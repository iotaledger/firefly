<script lang="typescript">
    import { getContext, onDestroy } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { api } from 'shared/lib/wallet'

    export let locale

    // version
    let currentVersion = '0.0.1' // dummy
    let upToDate = Math.random() < 0.5 // dummy

    // stronghold backup
    let lastBackupDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - Math.floor(Math.random() * 200)
    ) // dummy

    // stronghold status
    let strongholdLocked = Math.random() < 0.5 // dummy
    let isLedgerOpened = false
    let isDestroyed = false
    let isCheckingLedger = false
    let color = getBackupWarningColor(lastBackupDate)

    // stronghold backup
    let lastBackupDateFormatted = lastBackupDate ? diffDates(lastBackupDate, new Date()) : null
    $: strongholdStatusMessage = strongholdLocked ? 'locked' : 'unlocked'
    $: hardwareDeviceMessage = isLedgerOpened ? 'detected' : 'none_detected'

    const popupState = getContext('popupState')
    const walletAccounts = getContext('walletAccounts')

    function openPopup(type) {
        popupState.set({ active: true, type, props: { upToDate, currentVersion, lastBackupDate, lastBackupDateFormatted } })
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
        if (!isCheckingLedger && $walletAccounts.length > 0 && $walletAccounts[0].signerType.type.startsWith('Ledger')) {
            checkLedger($walletAccounts[0].signerType.type === 'LedgerNanoSimulator')
        }
    }

    onDestroy(() => {
        isDestroyed = true
    })
</script>

<div data-label="security" class="p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-2">
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: currentVersion } })}
            message={locale(`views.dashboard.security.version.${upToDate ? 'up_to_date' : 'out_of_date'}`)}
            color={upToDate ? 'green' : 'red'}
            icon="firefly"
            onClick={() => openPopup('update')} />
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
            color={strongholdLocked ? 'blue' : 'red'}
            icon="lock"
            onClick={() => openPopup('password')}
            classes={strongholdLocked ? 'pointer-events-none' : 'pointer-events-all'} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={lastBackupDate ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                    values: { time: lastBackupDateFormatted.value }
                }) : locale('popups.backup.not_backed_up')}
            onClick={()=> openPopup('backup')}
            icon="shield"
            {color} />
    </div>
</div>
