<script lang="typescript">
    import { getContext, onMount, onDestroy } from 'svelte'
    import { Text, SecurityTile } from 'shared/components'
    import { diffDates, getBackupWarningColor } from 'shared/lib/helpers'
    import { getActiveProfile, profiles } from 'shared/lib/app'
    import { api } from 'shared/lib/wallet'


    export let locale

    let activeProfile
    let lastBackupDate
    let lastBackupDateFormatted
    let color
    let strongholdStatusMessage


    function setup() {
        activeProfile = getActiveProfile()

        const { isStrongholdLocked, strongholdLastBackupTime } = activeProfile
        lastBackupDate = strongholdLastBackupTime ? new Date(strongholdLastBackupTime) : null
        lastBackupDateFormatted = diffDates(lastBackupDate, new Date())
        color = getBackupWarningColor(lastBackupDate)
        strongholdStatusMessage = isStrongholdLocked ? 'locked' : 'unlocked'
    }

    // version
    let currentVersion = '0.0.1' // dummy
    let upToDate = Math.random() < 0.5 // dummy

    const popupState = getContext('popupState')

    function openPopup(type) {
        popupState.set({
            active: true,
            type,
            props: {
                upToDate,
                currentVersion,
                lastBackupDate,
                lastBackupDateFormatted,
                isStrongholdLocked: activeProfile.isStrongholdLocked,
            },
        })
    }

    function lockStronghold() {
        api.lockStronghold({ 
            onSuccess() {
            },
            onError(error) {
                console.error(error)
            }
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
            color={activeProfile.isStrongholdLocked ? 'blue' : 'red'}
            icon="lock"
            onClick={() => activeProfile.isStrongholdLocked ? openPopup('password') : lockStronghold()} />
        <!-- Stronghold backup -->
        <SecurityTile
            title={locale('views.dashboard.security.stronghold_backup.title')}
            message={activeProfile.strongholdLastBackupTime ? locale(`dates.${lastBackupDateFormatted.unit}`, {
                      values: { time: lastBackupDateFormatted.value },
                  }) : locale('popups.backup.not_backed_up')}
            onClick={() => openPopup('backup')}
            icon="shield"
            {color} />
    </div>
</div>
