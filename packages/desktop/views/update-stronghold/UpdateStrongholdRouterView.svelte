<script lang="ts">
    import { Transition } from '@ui'
    import { UpdateStrongholdRoute } from './update-stronghold-route.enum'
    import { updateStrongholdRoute } from './update-stronghold-router'
    import { ChangePasswordView, UpdateBackupView, UpdateStrongholdView } from './views'

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
        <UpdateBackupView changedPassword={!!newPassword} {isRecovery} password={newPassword || password} />
    </Transition>
{/if}
