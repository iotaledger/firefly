<script lang="ts">
    import { ChangePasswordView, UpdateBackupView, UpdateStrongholdView } from './views'
    import { Transition } from '@ui'

    import { UpdateStrongholdRoute } from '@core/router/enums'
    import { updateStrongholdRoute } from '@core/router/subrouters'

    export let isRecovery = false

    let password: string = ''
    let newPassword: string = ''
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <Transition>
        <UpdateStrongholdView bind:password {isRecovery} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <Transition>
        <ChangePasswordView bind:newPassword oldPassword={password} {isRecovery} />
    </Transition>
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.SaveBackup}
    <Transition>
        <UpdateBackupView changedPassword={!!newPassword} {isRecovery} />
    </Transition>
{/if}
