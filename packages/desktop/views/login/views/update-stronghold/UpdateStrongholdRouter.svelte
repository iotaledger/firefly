<script lang="ts">
    import { ChangePasswordView, UpdateBackupView, UpdateStrongholdView } from './views'
    import { Transition } from '@ui'

    import { UpdateStrongholdRoute } from '@core/router/enums/login'
    import { updateStrongholdRoute } from '@core/router/subrouters/login'

    export let isRecovery = false

    let password: string = ''
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <Transition>
        <UpdateStrongholdView bind:password {isRecovery} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <Transition>
        <ChangePasswordView currentPassword={password} {isRecovery} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.SaveBackup}
    <Transition>
        <UpdateBackupView />
    </Transition>
{/if}
