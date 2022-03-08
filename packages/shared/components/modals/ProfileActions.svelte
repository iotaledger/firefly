<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Icon, Modal, Text, HR, Toggle } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { activeProfile, isStrongholdLocked, isSoftwareProfile, isLedgerProfile } from 'shared/lib/profile'
    import { openSettings } from 'shared/lib/router'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { api } from 'shared/lib/wallet'
    import { openPopup } from 'shared/lib/popup'
    import { getLedgerDeviceStatus, isLedgerConnected } from 'shared/lib/ledger'

    export let locale: Locale
    export let isActive: boolean

    const profileColor = 'blue' // TODO: each profile has a different color

    $: profileName = $activeProfile?.name
    $: profileInitial = getInitials(profileName, 1)

    const handleSettingsClick = (): void => {
        openSettings()
        isActive = false
    }

    const handleLogoutClick = async (): Promise<void> => {
        await logout()
    }

    function handleStrongholdToggleClick() {
        if ($isStrongholdLocked) {
            openPopup({
                type: 'password',
                props: {
                    isStrongholdLocked: $isStrongholdLocked,
                },
            })
        } else {
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
    }

    let isCheckingLedger: boolean = false
    let _isLedgerConnected: boolean = false
    function syncLedgerDeviceStatus() {
        isCheckingLedger = true
        const _onComplete = () => setTimeout(() => (isCheckingLedger = false), 500)
        getLedgerDeviceStatus(false, _onComplete, _onComplete, _onComplete)
        _isLedgerConnected = isLedgerConnected()
    }
</script>

<Modal bind:isActive position={{ bottom: '16px', left: '80px' }} classes="w-64">
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <Text>{profileName}</Text>
            {#if isLedgerProfile}
                <Icon icon="ledger" classes="text-gray-500 w-4 h-4" />
            {/if}
        </div>
        <HR />
        {#if $isSoftwareProfile}
            <div class="flex justify-between items-center p-3">
                <div class="flex items-center">
                    <Icon
                        icon={$isStrongholdLocked ? 'lock' : 'unlock'}
                        boxed
                        classes="text-blue-500"
                        boxClasses="bg-blue-100 mr-3"
                    />
                    <div>
                        <Text type="p">{locale('views.dashboard.profileModal.stronghold.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-1"
                            >{locale(
                                `views.dashboard.profileModal.stronghold.${$isStrongholdLocked ? 'locked' : 'unlocked'}`
                            )}</Text
                        >
                    </div>
                </div>
                <Toggle active={!$isStrongholdLocked} onClick={handleStrongholdToggleClick} classes="cursor-pointer" />
            </div>
        {:else}
            <div class="flex justify-between items-center p-3">
                <div class="flex items-center">
                    <Icon
                        icon="chip"
                        boxed
                        classes={_isLedgerConnected ? 'text-blue-500' : 'text-gray-500'}
                        boxClasses="{_isLedgerConnected ? 'bg-blue-100' : 'bg-gray-100'} mr-3"
                    />
                    <div>
                        <Text type="p">{locale('views.dashboard.profileModal.hardware.title')}</Text>
                        <Text type="p" overrideColor classes="text-gray-500 -mt-1"
                            >{locale(
                                `views.dashboard.profileModal.hardware.${
                                    _isLedgerConnected ? 'detected' : 'notDetected'
                                }`
                            )}</Text
                        >
                    </div>
                </div>
                <button on:click={syncLedgerDeviceStatus}>
                    <Icon
                        icon="refresh"
                        classes="{isCheckingLedger &&
                            'animate-spin-reverse'} text-gray-500 dark:text-white cursor-pointer"
                    />
                </button>
            </div>
        {/if}
        <HR />
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="settings" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('views.dashboard.profileModal.allSettings')}</Text
            >
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full"
        >
            <Icon icon="logout" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
