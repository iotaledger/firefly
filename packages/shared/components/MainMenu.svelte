<script lang="typescript">
	import { Drawer, Icon, Text, ProfileActions } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'
    import { Settings } from 'shared/routes'
    import { 
        profileRoute, 
        profileRouter, 
        ProfileRoute, 
        settingsRoute, 
        settingsRouter, 
        SettingsRoute 
    } from '@core/router'
    import { localize } from '@core/i18n'

    $: profileColor = getColor($activeProfile, $selectedAccount?.id) as string

    let drawer: Drawer

    $: profileInitial = getInitials($activeProfile?.name, 1)

    async function handleBackClick() {
        if ($profileRoute === ProfileRoute.ProfileActions) {
            drawer.close()
        } else if ($settingsRoute === SettingsRoute.Init) {
            $profileRouter.previous()
        } else {
            $settingsRouter.goTo(SettingsRoute.Init)
        }
    }

    function handleClick() {
        $profileRouter.goTo(ProfileRoute.ProfileActions)
        drawer.open()
    }

    function handleSettingsClick() {
        $profileRouter.goTo(ProfileRoute.Settings)
    }
</script>

<button
    class="menu-button fixed left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full leading-100"
    style="--background-color: {profileColor};"
    on:click={handleClick}
>
    <Text type="h4" overrideColor classes="z-10 uppercase">{profileInitial || 'A'}</Text>
    <div class="w-11 h-11 flex rounded-full bg-white leading-100 opacity-20 absolute" />
</button>
<Drawer bind:this={drawer} fromLeft fullScreen classes="flex">
    <div class="flex flex-col flex-1 mx-4">
        <header
            class="w-full mt-3 py-3 px-9 mb-5 flex items-centers justify-center bg-white dark:bg-gray-800"
            on:click={handleBackClick}
        >
            <Icon icon="arrow-left" classes="absolute mb-5 left-8 text-gray-500 text-blue-500" />
            <Text type="h4" classes="text-center">
                {localize(
                    $profileRoute === ProfileRoute.ProfileActions
                        ? 'views.settings.profile.title'
                        : $settingsRoute === SettingsRoute.Init
                        ? 'views.settings.settings'
                        : `views.settings.${$settingsRoute}.title`
                )}
            </Text>
        </header>
        {#if $profileRoute === ProfileRoute.ProfileActions}
            <ProfileActions 
                {profileColor} {profileInitial} 
                {handleSettingsClick} />
        {:else if $profileRoute === ProfileRoute.Settings}
            <Settings />
        {/if}
        
    </div>
</Drawer>

<style>
    header {
        border-top: solid transparent calc(env(safe-area-inset-top) / 1.5);
    }
    .menu-button {
        background-color: var(--background-color);
        margin-top: calc(env(safe-area-inset-top) + 10px);
    }
</style>
