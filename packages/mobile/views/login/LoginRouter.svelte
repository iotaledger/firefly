<script lang="ts">
    import { EnterPinView, LoadProfileView, SelectProfileView } from './views'

    import { loginRoute, LoginRoute } from '@/routers'
</script>

{#if $loginRoute === LoginRoute.SelectProfile}
    <SelectProfileView />
{:else if $loginRoute === LoginRoute.EnterPin}
    <EnterPinView />
{:else if $loginRoute === LoginRoute.LoadProfile}
    <LoadProfileView />
{/if}
