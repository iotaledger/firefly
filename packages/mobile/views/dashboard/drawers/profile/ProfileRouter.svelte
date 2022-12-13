<script lang="typescript">
    import { ProfileRoute, profileRoute } from '../../../../lib/routers'
    import { ActionsView, SettingsView } from './views'

    export let changeTitle: (title: string) => void
</script>

{#if $profileRoute === ProfileRoute.Actions}
    <ActionsView />
{:else if $profileRoute === ProfileRoute.Settings}
    <SettingsView {changeTitle} />
{/if}
