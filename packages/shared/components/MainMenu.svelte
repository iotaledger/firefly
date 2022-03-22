<script lang="typescript">
    import { Drawer, Icon, Text } from 'shared/components'
    import { getInitials } from 'shared/lib/helpers'
    import { activeProfile } from 'shared/lib/profile'
    import { settingsRoute, settingsChildRoute } from 'shared/lib/router'
    import { SettingsRoutes } from 'shared/lib/typings/routes'
    import { Settings } from 'shared/routes'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let drawer: Drawer
    const profileColor = 'blue' // TODO: each profile has a different color

    $: profileInitial = getInitials($activeProfile?.name, 1)
    
    function handleBackClick() {
        if ($settingsRoute === SettingsRoutes.Init) {
            drawer?.close()
        } else {
            settingsRoute.set(SettingsRoutes.Init)
        }
    }

    function handleClick() {
        settingsRoute.set(SettingsRoutes.Init)
        settingsChildRoute.set(null)
        drawer.open()
    }
</script>

<button
    class="menu-button z-10 w-9 h-9 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
    on:click={handleClick}
>
    <span class="text-12 text-center text-white uppercase">{profileInitial || 'A'}</span>
</button>
<Drawer 
    bind:this={drawer}
    fromRight
    dimLength={0}
    fullScreen 
    classes="flex"
>
    <div class="flex flex-col flex-1">
        <header
            class="w-full px-8 py-3 mb-6 flex items-centers justify-center bg-white dark:bg-gray-800"
            on:click={handleBackClick}
        >
            <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
            <Text type="h4" classes="text-center">
                {locale(
                    $settingsRoute === SettingsRoutes.Init
                        ? 'general.yourWallets'
                        : `views.settings.${$settingsRoute}.title`
                )}
            </Text>
        </header>
        {#if $settingsRoute === SettingsRoutes.Init}
            <!-- TODO: add real profile data -->
            <div class="flex flex-row items-center space-x-6 mb-7 px-6 w-full">
                <div
                    class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                >
                    <span class="text-20 text-center text-white uppercase font-semibold"
                        >{profileInitial || 'A'}</span
                    >
                </div>
                <Text type="h4">{$activeProfile?.name || 'John Doe'}</Text>
            </div>
        {/if}
        <Settings {locale} />
    </div>
</Drawer>

<style>
    button {
        position: absolute;
        margin-top: 35px;
        top: env(safe-area-inset-top);
        right: 30px;
    }
</style>