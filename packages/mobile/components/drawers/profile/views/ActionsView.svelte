<script lang="ts">
    import { NetworkStatusButton, ProfileActionButton, ProfileBackupButton, ProfileLockButton } from '@components'
    import { FontWeight, Icon, NetworkIcon, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import { NetworkProtocol } from '@core/network'
    import { activeProfile, lockStronghold, logout } from '@core/profile'
    import { getInitials, isRecentDate } from '@core/utils'

    import { showAppNotification } from '@auxiliary/notification'
    import { exportStronghold } from '@contexts/settings'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { profileRouter } from '@/routers'
    import features from '@features/features'
    import { Icon as IconTypes } from '@lib/auxiliary/icon'

    const { isStrongholdLocked } = $activeProfile

    let networkProtocol: NetworkProtocol
    $: networkProtocol = $activeProfile.networkProtocol

    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanAMonth

    let initials: string
    $: initials = getInitials($activeProfile.name, 1)

    function onLogoutClick(): void {
        void logout()
    }

    function onLockToggleClick(): void {
        if ($isStrongholdLocked) {
            openDrawer(DrawerId.EnterPassword)
        } else {
            lockStronghold()
        }
    }

    function onBackupClick(): void {
        function _handleExportStrongholdResponse(cancelled, error): void {
            if (!cancelled) {
                if (error) {
                    showAppNotification({
                        type: 'error',
                        message: localize(error),
                    })
                } else {
                    showAppNotification({
                        type: 'info',
                        message: localize('general.exportingStrongholdSuccess'),
                    })
                }
            }
        }
        function _handleBackup(password): void {
            exportStronghold(password, _handleExportStrongholdResponse)
        }
        openDrawer(DrawerId.EnterPassword, { returnPassword: true, onSuccess: _handleBackup })
    }

    function onNetworkStatusClick(): void {}

    function onSettingsClick(): void {
        $profileRouter.next()
    }
</script>

{#if $activeProfile?.id}
    <div class="w-full flex flex-col space-y-14">
        <div class="flex flex-col">
            <div class="flex flex-row justify-center">
                <div class="relative">
                    <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                        <Text type={TextType.h5} classes="text-white">{initials}</Text>
                    </div>
                    <div class="absolute right-0 bottom-0">
                        <NetworkIcon {networkProtocol} height={14} width={14} />
                    </div>
                </div>
            </div>
            <Text
                type={TextType.h4}
                color="gray-800"
                darkColor="white"
                fontWeight={FontWeight.semibold}
                lineHeight="5"
                classes="text-center pt-4"
            >
                {$activeProfile.name}
            </Text>
            <div class="flex justify-center">
                <button class="inline-flex p-1" on:click={onLogoutClick}>
                    <Icon width="16" height="16" icon={IconTypes.Logout} classes="text-blue-500 my-auto" />
                    <Text type={TextType.p} overrideColor classes="text-blue-500 pl-1">
                        {localize('views.dashboard.profileModal.logout')}
                    </Text>
                </button>
            </div>
        </div>
        <div class="flex flex-col space-y-4">
            {#if features?.dashboard?.profileActions?.backupProfile?.enabled && !isBackupSafe}
                <ProfileBackupButton {lastBackupDate} onClick={onBackupClick} />
            {/if}
            {#if features?.dashboard?.profileActions?.networkStatus?.enabled}
                <NetworkStatusButton onClick={onNetworkStatusClick} />
            {/if}
            {#if features?.dashboard?.profileActions?.profileLock?.enabled}
                <ProfileLockButton onClick={onLockToggleClick} />
            {/if}
            {#if features?.settings?.enabled}
                <ProfileActionButton
                    primaryText={localize('views.dashboard.profileModal.allSettings')}
                    secondaryText={localize('views.dashboard.profileModal.profileApplication')}
                    icon={IconTypes.Settings}
                    iconColor="blue-500"
                    color="transparent"
                    onClick={onSettingsClick}
                />
            {/if}
        </div>
    </div>
{/if}
