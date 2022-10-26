<script lang="typescript">
    import { tryCreateAdditionalAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'

    import { Drawer, StrongholdUnlock } from '../../../../components'
    import { AccountSwitcherRoute, accountSwitcherRoute, accountSwitcherRouter } from '../../../../lib/routers'
    import { AccountSwitcher, CreateAccount } from './views'

    export let onClose: () => unknown = () => {}

    let accountAlias: string
    let color: string
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

    async function onCreate(newAccountAlias: string, newColor: string): Promise<void> {
        accountAlias = newAccountAlias
        color = newColor

        const isUnlocked = await isStrongholdUnlocked()
        if (isUnlocked) {
            await tryCreateAdditionalAccount(newAccountAlias, newColor)
            onClose()
        } else {
            $accountSwitcherRouter.next()
        }
    }

    async function onSuccess(): Promise<void> {
        await tryCreateAdditionalAccount(accountAlias, color)
        onClose()
    }
</script>

<Drawer {onClose} {title}>
    {#if $accountSwitcherRoute === AccountSwitcherRoute.Switcher}
        <AccountSwitcher onSwitch={onClose} onAddClicked={() => $accountSwitcherRouter.next()} />
    {/if}
    {#if $accountSwitcherRoute === AccountSwitcherRoute.CreateAccount}
        <CreateAccount {onCreate} onCancel={() => $accountSwitcherRouter.previous()} />
    {/if}
    {#if $accountSwitcherRoute === AccountSwitcherRoute.Password}
        <StrongholdUnlock
            {onSuccess}
            onCancel={() => $accountSwitcherRouter.previous()}
            busyMessage={localize('general.creating')}
        />
    {/if}
</Drawer>
