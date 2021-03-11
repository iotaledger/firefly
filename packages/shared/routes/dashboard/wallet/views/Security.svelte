<script lang="typescript">
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, profiles } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let color
    let strongholdStatusMessage

    function setup() {
        const ap = get(activeProfile);
        const isStrongholdLocked = ap?.isStrongholdLocked
        const lastStrongholdBackupTime = ap?.lastStrongholdBackupTime
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
                isStrongholdLocked: get(activeProfile)?.isStrongholdLocked,
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

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(setup)
    onDestroy(unsubscribe)
</script>

<div data-label="security" class="p-8 flex-grow flex flex-col">
    <Text type="h4" classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-2">
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } })}
            message={locale(`views.dashboard.security.version.${$versionDetails.upToDate ? 'up_to_date' : 'out_of_date'}`)}
            color={$versionDetails.upToDate ? 'blue' : 'yellow'}
            icon="firefly"
            onClick={() => handleSecurityTileClick('version')} />
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
            color={$activeProfile?.isStrongholdLocked ? 'blue' : 'yellow'}
            icon="lock"
            onClick={() => (get(activeProfile)?.isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold())} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={$activeProfile?.lastStrongholdBackupTime ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }) : locale('popups.backup.not_backed_up')}
            onClick={() => handleSecurityTileClick('backup')}
            icon="shield"
            {color} />
    </div>
</div>
