<script lang="ts">
    import { Transition } from 'shared/components'
    import { EnterPinView, SelectProfileView, LoadProfileView, UpdateStrongholdRouter } from './views'
    import { loginRoute, LoginRoute } from '@core/router'
</script>

{#if $loginRoute === LoginRoute.SelectProfile}
    <Transition>
        <SelectProfileView />
    </Transition>
{:else if $loginRoute === LoginRoute.EnterPin}
    <Transition>
        <EnterPinView />
    </Transition>
{:else if $loginRoute === LoginRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdRouter />
    </Transition>
{:else if $loginRoute === LoginRoute.LoadProfile}
    <Transition>
        <LoadProfileView />
    </Transition>
{/if}
