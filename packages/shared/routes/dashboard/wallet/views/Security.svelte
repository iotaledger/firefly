<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { isStrongholdLocked } from 'shared/lib/wallet'

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

    let color = getBackupWarningColor(lastBackupDate)

    // stronghold backup
    let lastBackupDateFormatted = lastBackupDate ? diffDates(lastBackupDate, new Date()) : null
    $: strongholdStatusMessage = $isStrongholdLocked ? 'locked' : 'unlocked'

    const popupState = getContext('popupState')

    function openPopup(type) {
        popupState.set({ active: true, type, props: { upToDate, currentVersion, lastBackupDate, lastBackupDateFormatted } })
    }
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
            message={locale('views.dashboard.security.hardware_device.none_detected')}
            color="gray"
            icon="chip"
            classes="pointer-events-none" />
        <!-- Stronghold status -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_status.title')}
            message={locale(`views.dashboard.security.stronghold_status.${strongholdStatusMessage}`)}
            color={$isStrongholdLocked ? 'blue' : 'red'}
            icon="lock"
            onClick={() => openPopup('password')}
            classes={$isStrongholdLocked ? 'pointer-events-all' : 'pointer-events-none'} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={lastBackupDate ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }) : locale('popups.backup.not_backed_up')}
            onClick={() => openPopup('backup')}
            icon="shield"
            color={color} />
    </div>
</div>
