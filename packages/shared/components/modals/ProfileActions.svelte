<script lang="typescript">
    import { Icon, Modal, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { getInitials } from 'shared/lib/helpers'
    import { dir } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { get } from 'svelte/store'
    import { fade } from 'svelte/transition'

    export let isActive
    export let locale
    export let openSettings = () => {}

    const profileColor = 'blue' // TODO: each profile has a different color
    const profileName = get(activeProfile)?.name
    const profileInitial = getInitials(profileName, 1)

    let pos: { [id: string]: string } = { bottom: '16px' }
    dir.subscribe((val) => {
        delete pos[val === 'ltr' ? 'right' : 'left']
        pos[val === 'ltr' ? 'left' : 'right'] = '80px'
    })

    const handleSettingsClick = () => {
        openSettings()
        isActive = false
    }
    const handleLogoutClick = () => {
        logout()
    }
</script>

<Modal bind:isActive position={pos}>
    <profile-modal-content class="flex flex-col" in:fade={{ duration: 100 }}>
        <div class="flex flex-row flex-nowrap items-center p-3">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-full bg-{profileColor}-500">
                <span class="text-12 leading-100 text-center text-white uppercase">{profileInitial}</span>
            </div>
            <Text classes="px-3">{profileName}</Text>
        </div>
        <hr class="border-t border-solid border-gray-200 dark:border-gray-700" />
        <button
            on:click={() => handleSettingsClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon
                icon="settings"
                classes={`text-gray-500 ${$dir === 'ltr' ? 'ml-1 mr-3' : 'ml-3 mr-1'} group-hover:text-blue-500`} />
            <Text smaller classes="group-hover:text-blue-500">{locale(`views.dashboard.profileModal.allSettings`)}</Text>
        </button>
        <button
            on:click={() => handleLogoutClick()}
            class="group flex flex-row justify-start items-center hover:bg-blue-50 py-3 px-3 w-full">
            <Icon
                icon="logout"
                classes={`text-gray-500 ${$dir === 'ltr' ? 'ml-1 mr-3' : 'ml-3 mr-1'} group-hover:text-blue-500`} />
            <Text smaller classes="group-hover:text-blue-500">{locale(`views.dashboard.profileModal.logout`)}</Text>
        </button>
    </profile-modal-content>
</Modal>
