<script lang="typescript">
    import { Drawer, Icon, Text } from 'shared/components'
    import { logout } from 'shared/lib/app'
    import { isBright, getInitials } from 'shared/lib/helpers'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'
    import { settingsRoute, settingsChildRoute } from 'shared/lib/router'
    import { SettingsRoutes } from 'shared/lib/typings/routes'
    import { Settings } from 'shared/routes'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    $: color = getColor($activeProfile, $selectedAccount?.id) as string
    $: textColor = isBright(color) ? 'gray-800' : 'white'

    let drawer: Drawer
    const profileColor = getColor($activeProfile, $activeProfile.id)

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
    class="menu-button fixed top-5 left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full leading-100"
    style="background-color: {color};"
    on:click={handleClick}
>
    <Text type="h4" classes="uppercase text-{textColor}">{profileInitial || 'A'}</Text>
    <div class="w-11 h-11 flex rounded-full bg-white leading-100 opacity-20 absolute" />
</button>
<Drawer bind:this={drawer} fromRight dimLength={0} fullScreen classes="flex">
    <div class="flex flex-col flex-1">
        <header
            class="w-full mt-3 py-3 px-9 mb-5 flex items-centers justify-center bg-white dark:bg-gray-800"
            on:click={handleBackClick}
        >
            <Icon icon="arrow-left" classes="absolute mb-5 left-8 text-gray-500 text-blue-500" />
            <Text type="h4" classes="text-center">
                {locale(
                    $settingsRoute === SettingsRoutes.Init
                        ? 'general.yourWallets'
                        : `views.settings.${$settingsRoute}.title`
                )}
            </Text>
        </header>
        {#if $settingsRoute === SettingsRoutes.Init}
            <div class="grid profile-block space-x-5 px-6 w-full mb-6">
                <div
                    class="row-span-4 w-16 h-16 flex items-center justify-center rounded-full leading-100"
                    style="background-color: {color};"
                >
                    <span class="text-20 text-center text-white uppercase font-semibold">{profileInitial}</span>
                </div>
                <Text type="h4" classes="col-start-2 row-start-2">{$activeProfile?.name}</Text>
                <button class="col-start-2 row-start-3 flex items-center" on:click={() => logout()}>
                    <Icon width="16" height="16" classes="mr-1 text-gray-500" icon="refresh" />
                    <Text type="p" secondary classes="text-center">Switch Accounts</Text>
                </button>
            </div>
        {/if}
        <Settings {locale} />
    </div>
</Drawer>

<style>
    header {
        border-top: solid transparent calc(env(safe-area-inset-top) / 1.5);
    }
    .menu-button {
        padding-top: env(safe-area-inset-top);
    }
    .profile-block {
        grid-template-columns: auto 1fr;
    }
</style>
