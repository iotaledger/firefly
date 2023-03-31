<script lang="ts">
    import { Transition } from 'shared/components'
    import { ChangePasswordView, SaveBackupView, UpdateStrongholdView } from './views'
    import { updateStrongholdRoute, UpdateStrongholdRoute } from '@core/router'
    import { Router } from '@core/router/router'

    export let parentRouter: Router<unknown>
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.UpdateStronghold}
    <Transition>
        <UpdateStrongholdView {parentRouter} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <Transition>
        <ChangePasswordView />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.SaveBackup}
    <Transition>
        <SaveBackupView {parentRouter} />
    </Transition>
{/if}
