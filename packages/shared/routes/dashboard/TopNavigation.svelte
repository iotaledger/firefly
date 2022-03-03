<script lang="typescript">
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { AccountSwitcher, Icon, Text } from 'shared/components'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { appRoute, AppRoute, SettingsRoute, settingsRoute } from '@core/router'

    export let onCreateAccount = (..._: any[]): void => {}

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    $: showBackButton = isCorrectRoute($appRoute)

    function isCorrectRoute(route: AppRoute): boolean {
        const showInSettings = $settingsRoute !== SettingsRoute.Init
        return showInSettings
    }

    function handleBackClick() {
        if ($appRoute === AppRoute.Settings) {
            settingsRoute.set(SettingsRoute.Init)
        }
    }
</script>

<div
    class="bg-gray-200 dark:bg-gray-800 border-solid border-b border-gray-300 dark:border-gray-700 flex flex-row justify-center py-2 w-full"
>
    {#if showBackButton}
        <button on:click={handleBackClick} class="absolute left-6">
            <div class="flex items-center space-x-3">
                <Icon icon="arrow-left" classes="text-gray-500" />
                <Text bigger overrideColor classes="text-gray-500">{localize('actions.back')}</Text>
            </div>
        </button>
    {/if}
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>
