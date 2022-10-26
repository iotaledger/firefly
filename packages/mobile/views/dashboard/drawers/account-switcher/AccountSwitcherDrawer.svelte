<script lang="typescript">
    import { localize } from '@core/i18n'

    import { Drawer } from '../../../../components'
    import { AccountSwitcherRoute, accountSwitcherRoute } from '../../../../lib/routers'
    import AccountSwitcherRouter from './AccountSwitcherRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string

    $: $accountSwitcherRoute, setTitle()

    function setTitle(): void {
        switch ($accountSwitcherRoute) {
            case AccountSwitcherRoute.CreateAccount:
                title = localize('general.createAccount')
                break
            case AccountSwitcherRoute.Password:
                title = localize('popups.password.title')
                break
            default:
                title = localize('general.accounts')
                break
        }
    }
</script>

<Drawer {onClose} {title}>
    <AccountSwitcherRouter {onClose} />
</Drawer>
