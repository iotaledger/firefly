<script lang="typescript">
    import { localize } from '@core/i18n'
    import features from '@features/features'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { Button } from '@ui'
    import { AccountAction } from '../../../../../lib/contexts/dashboard'
    import { accountActionsRouter } from '../../../../../lib/routers'

    function handleCustomizeAccountClick(): void {
        $accountActionsRouter.next({ action: AccountAction.Customize })
    }
</script>

<div class="flex flex-col space-y-4">
    {#if features?.dashboard?.accountActions?.customize?.enabled}
        <Button outline onClick={handleCustomizeAccountClick} icon={Icon.Customize}>
            {localize('actions.customizeAcount')}
        </Button>
    {/if}
</div>
