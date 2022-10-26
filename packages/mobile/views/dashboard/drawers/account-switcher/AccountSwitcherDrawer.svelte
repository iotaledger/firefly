<script lang="typescript">
    import { localize } from '@core/i18n'
    import { tryCreateAdditionalAccount } from '@core/account'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { Drawer, StrongholdUnlock } from '../../../../components'
    import { AccountSwitcherRoute, accountSwitcherRoute, accountSwitcherRouter } from '../../../../lib/routers'
    import { onDestroy } from 'svelte'
    import { AccountSwitcher, CreateAccount } from './views'

    export let onClose: () => unknown = () => {}

    let accountAlias = ''
    let color = ''

    const titles = {
        [AccountSwitcherRoute.Switcher]: localize('general.accounts'),
        [AccountSwitcherRoute.CreateAccount]: localize('general.createAccount'),
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

    async function onUnlock() {
        await tryCreateAdditionalAccount(accountAlias, color)
        onClose()
    }

    onDestroy(() => {
        $accountSwitcherRouter.reset()
    })
</script>

<Drawer {onClose} title={titles[$accountSwitcherRoute]}>
    {#if $accountSwitcherRoute === AccountSwitcherRoute.Switcher}
        <AccountSwitcher onSwitch={onClose} onAddClicked={() => $accountSwitcherRouter.next()} />
    {/if}
    {#if $accountSwitcherRoute === AccountSwitcherRoute.CreateAccount}
        <CreateAccount {onCreate} onCancel={() => $accountSwitcherRouter.previous()} />
    {/if}
    {#if $accountSwitcherRoute === AccountSwitcherRoute.Password}
        <StrongholdUnlock
            {onUnlock}
            onCancel={() => $accountSwitcherRouter.previous()}
            busyMessage={localize('general.creating')}
        />
    {/if}
</Drawer>
