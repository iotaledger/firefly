<script lang="ts">
    import { ChangePasswordView, UpdateStrongholdView } from './views'
    import { UpdateStrongholdRoute } from '@core/router/enums/login'
    import { updateStrongholdRoute } from '@core/router/subrouters/login'

    let password: string = ''
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <UpdateStrongholdView bind:password />
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.ChangePassword}
    <ChangePasswordView actualPassword={password} />
{/if}
