<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, isRecentDate } from 'shared/lib/helpers'

    export let locale

    // version
    let currentVersion = '1.32' // dummy
    let upToDate = Math.random() < 0.5 // dummy

    // stronghold backup
    let strongholdLastBackup = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - Math.floor(Math.random() * 28)
    ) // dummy

    // stronghold status
    let strongholdLocked = Math.random() < 0.5 // dummy
    let strongholdRecentBackup = strongholdLastBackup ? isRecentDate(strongholdLastBackup) : null // dummy

    // stronghold backup
    let strongholdBackupTimeAgo = strongholdLastBackup ? diffDates(strongholdLastBackup, new Date()) : null // dummy
    $: strongholdStatusMessage = strongholdLocked ? 'locked' : 'unlocked'

    const popupState = getContext('popupState')

    function openPopup(type) {
        switch (type) {
            case 'update':
                popupState.set({ active: true, type, props: { upToDate, currentVersion } })
                break
            case 'password':
                popupState.set({ active: true, type })
                break
            case 'backup':
                popupState.set({ active: true, type, props: { lastBackup: strongholdLastBackup } })
                break
            default:
                console.error('Wrong popup type selected')
        }
    }
</script>

<div data-label="security" class="p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-2">
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: currentVersion } })}
            message={locale(`views.dashboard.security.version.${upToDate ? 'up_to_date' : 'out_of_date'}`)}
            color={upToDate ? 'yellow' : 'red'}
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
            color={strongholdLocked ? 'green' : 'red'}
            icon="lock"
            onClick={() => openPopup('password')}
            classes={strongholdLocked ? 'pointer-events-none' : 'pointer-events-all'} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={strongholdLastBackup ? locale(`dates.${strongholdBackupTimeAgo.unit}`, {
                      values: { time: strongholdBackupTimeAgo.value },
                  }) : locale('popups.backup.not_backed_up')}
            onClick={() => openPopup('backup')}
            icon="shield"
            color={strongholdRecentBackup ? 'blue' : 'red'} />
    </div>
</div>
