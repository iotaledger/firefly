<script lang="typescript">
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'
    import { localize } from '@core/i18n'
    import { AccountSwitcher, Icon, Text } from 'shared/components'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { DashboardRoute, dashboardRoute, SettingsRoute, settingsRoute, settingsRouter } from '@core/router'

    export let onCreateAccount = (..._: any[]): void => {}
    export let classes: string

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')

    $: showBackButton = isCorrectRoute($settingsRoute)

    function isCorrectRoute(_: SettingsRoute): boolean {
        return $settingsRoute !== SettingsRoute.Init
    }

    function handleBackClick(): void {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                $settingsRouter.previous()
                break
            default:
                break
        }
    }
</script>

<div
    class="bg-gray-200 dark:bg-gray-1000 border-solid border-b border-gray-300 dark:border-gray-1000 flex flex-row justify-center py-2 w-full {classes}"
>
    {#if showBackButton}
        <button on:click={handleBackClick} class="absolute left-24 cursor-pointer">
            <div class="flex items-center space-x-2 ">
                <Icon width="18" icon="arrow-left" classes="text-gray-500" />
                <Text overrideColor classes="text-gray-500">{localize('actions.back')}</Text>
            </div>
        </button>
    {/if}
    <AccountSwitcher {onCreateAccount} accounts={$viewableAccounts} />
</div>
