<script lang="typescript">
    import { SecurityTile, Text } from 'shared/components'
    import { versionDetails } from 'shared/lib/appUpdater'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, isStrongholdLocked, profiles } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale

    let lastBackupDate
    let lastBackupDateFormatted
    let color
    let strongholdStatusMessage

    function setup() {
        const ap = get(activeProfile)
        const lastStrongholdBackupTime = ap?.lastStrongholdBackupTime
        lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
        lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
        color = getBackupWarningColor(lastBackupDate)
        strongholdStatusMessage = get(isStrongholdLocked) ? 'locked' : 'unlocked'
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

    const unsubscribe = profiles.subscribe(() => {
        setup()
    })

    onMount(setup)
    onDestroy(unsubscribe)
</script>

<div data-label="security" class="py-6 px-8 flex-grow flex flex-col">
    <Text type="p" bold classes="mb-5">{locale('general.security')}</Text>
    <div class="grid grid-cols-2 gap-2">
        <!-- Firefly version -->
        <SecurityTile
            title={locale('views.dashboard.security.version.title', { values: { version: $versionDetails.currentVersion } })}
            message={locale(`views.dashboard.security.version.${$versionDetails.upToDate ? 'upToDate' : 'outOfDate'}`)}
            color={$versionDetails.upToDate ? 'blue' : 'yellow'}
            icon="firefly"
            onClick={() => handleSecurityTileClick('version')} />
        <!-- Hardware Device -->
        <SecurityTile
            title={locale('views.dashboard.security.hardwareDevice.title')}
            message={locale('views.dashboard.security.hardwareDevice.noneDetected')}
            color="gray"
            icon="chip"
            classes="pointer-events-none" />
        <!-- Stronghold status -->
        <SecurityTile
            title={locale('views.dashboard.security.strongholdStatus.title')}
            message={locale(`views.dashboard.security.strongholdStatus.${strongholdStatusMessage}`)}
            color={$isStrongholdLocked ? 'blue' : 'yellow'}
            icon="lock"
            onClick={() => ($isStrongholdLocked ? handleSecurityTileClick('password') : lockStronghold())} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.strongholdBackup.title')}
            message={$activeProfile?.lastStrongholdBackupTime ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }) : locale('popups.backup.notBackedUp')}
            onClick={() => handleSecurityTileClick('backup')}
            icon="shield"
            {color} />
    </div>
</div>
