<script lang="typescript">
    import { Transition } from 'shared/components'
    import { SetPasswordView } from './views'
    import { passwordSetupRoute, PasswordSetupRoute } from '@core/router'
</script>

{#if $passwordSetupRoute === PasswordSetupRoute.SetPassword}
    <Transition>
        <SetPasswordView />
    </Transition>
{/if}
