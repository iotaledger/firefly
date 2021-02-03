<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Text, Icon, Modal } from 'shared/components'
    import { getActiveProfile } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { AppRoute, setRoute } from 'shared/lib/router'

    export let isActive
    export let locale
    export let openSettings = () => {}

    const profileColor = 'blue' // TODO: each profile has a different color
    const profileName = getActiveProfile().name
    const profileInitial = getInitials(profileName, 1)

    const handleSettingsClick = () => {
        openSettings()
        isActive = false
    }
    const handleLogoutClick = () => {
        isActive = false
        setRoute(AppRoute.Login)
    }
</script>

<Modal bind:isActive position={{ bottom: '16px', left: '16px' }}>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center space-x-3 p-3">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <Text>{profileName}</Text>
        </div>
        <hr class="border-t border-solid border-gray-200 dark:border-gray-700" />
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon icon="settings" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`views.dashboard.profile_modal.all_settings`)}</Text>
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon icon="logout" classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
            <Text smaller classes="group-hover:text-blue-500">{locale(`views.dashboard.profile_modal.logout`)}</Text>
        </button>
    </profile-modal-content>
</Modal>
