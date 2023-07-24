<script lang="ts">
    import { ISetting, isSettingVisible } from '@contexts/settings'
    import { activeProfile, isActiveLedgerProfile } from '@core/profile'
    import { SettingsRoute } from '@core/router'
    import features from '@features/features'
    import { SETTINGS } from './settings.constant'

    export let category: SettingsRoute

    const { loggedIn } = $activeProfile

    $: visibleSettings =
        (SETTINGS?.[category] as ISetting[])?.filter((setting) =>
            isSettingVisible(
                setting,
                features?.settings?.[category]?.[setting.childRoute]?.enabled,
                $loggedIn,
                !$isActiveLedgerProfile,
                $isActiveLedgerProfile
            )
        ) ?? []
</script>

<div class="flex flex-col space-y-5">
    {#each visibleSettings as { component, childRoute, props }, index}
        <section id={childRoute} class="w-full sm:w-3/4">
            <svelte:component this={component} {...props} route={childRoute} />
        </section>
        {#if index < visibleSettings.length - 1}
            <hr />
        {/if}
    {/each}
</div>
