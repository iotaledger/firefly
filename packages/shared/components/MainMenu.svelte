<script lang="typescript">
    import { Drawer, Icon, Text, ProfileActions } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { activeProfile } from 'shared/lib/profile'
    import { Settings } from 'shared/routes'
    import {
        profileRoute,
        profileRouter,
        ProfileRoute,
        settingsRoute,
        settingsRouter,
        SettingsRoute,
    } from '@core/router'
    import { localize } from '@core/i18n'
    import { AccountColor } from '@lib/typings/color'

    export let opacity = 1

    const profileColor = AccountColor.Blue // TODO: each profile will have a different color
    let drawer: Drawer

    $: profileInitial = getInitials($activeProfile?.name, 1)

    function handleBackClick(): void {
        if ($profileRoute === ProfileRoute.ProfileActions) {
            drawer.close()
        } else if ($settingsRoute === SettingsRoute.Init) {
            $profileRouter.previous()
        } else {
            $settingsRouter.goTo(SettingsRoute.Init)
        }
    }

    function handleClick(): void {
        $profileRouter.goTo(ProfileRoute.ProfileActions)
        drawer.open()
    }

    function handleSettingsClick(): void {
        $profileRouter.goTo(ProfileRoute.Settings)
    }
</script>

<button
    class="menu-button fixed left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full leading-100"
    style="--background-color: {profileColor}; --opacity: {opacity}"
    on:click={handleClick}
>
    <span class="text-14 font-600 text-center text-white uppercase">{profileInitial || 'A'}</span>
</button>
<Drawer bind:this={drawer} fromLeft classes="flex">
    <div class="flex flex-col flex-1 px-5">
        <header
            class="w-full mt-3 py-3 px-9 mb-5 flex items-centers justify-center bg-white dark:bg-gray-800"
            on:click={handleBackClick}
        >
            <Icon icon="arrow-left" classes="absolute mb-5 left-5 text-gray-500 text-blue-500" />
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
            <ProfileActions {profileColor} {profileInitial} {handleSettingsClick} />
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
        opacity: var(--opacity);
    }
</style>
