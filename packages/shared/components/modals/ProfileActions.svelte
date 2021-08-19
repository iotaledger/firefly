<script lang="typescript">
    import { Icon, Modal, Text, HR } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { activeProfile } from 'shared/lib/profile'
    import { get } from 'svelte/store'
    import { fade } from 'svelte/transition'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let isActive

    export let openSettings = (): void => {}

    const profileColor = 'blue' // TODO: each profile has a different color
    const profileName = get(activeProfile)?.name
    const profileInitial = getInitials(profileName, 1)

    const handleSettingsClick = () => {
        openSettings()
        isActive = false
    }
    const handleLogoutClick = () => {
        logout()
    }
</script>

<Modal bind:isActive position={{ bottom: '16px', left: '80px' }}>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <Text>{profileName}</Text>
        </div>
        <HR />
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full">
            <Icon icon="settings" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('views.dashboard.profileModal.allSettings')}</Text>
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20 py-3 px-3 w-full">
            <Icon icon="logout" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale('views.dashboard.profileModal.logout')}</Text>
        </button>
    </profile-modal-content>
</Modal>
