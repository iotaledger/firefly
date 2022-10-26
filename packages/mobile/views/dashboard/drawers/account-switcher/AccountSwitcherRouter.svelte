<script lang="typescript">
    import { tryCreateAdditionalAccount } from '@core/account'
    import { isStrongholdUnlocked } from '@core/profile-manager'

    import { AccountSwitcherRoute, accountSwitcherRoute, accountSwitcherRouter } from '../../../../lib/routers'
    import { StrongholdUnlock } from '../../../../components'
    import { AccountSwitcher, CreateAccount } from './views'

    export let onClose: () => unknown = () => {}

    let accountAlias: string
    let color: string

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

{#if $accountSwitcherRoute === AccountSwitcherRoute.Switcher}
    <AccountSwitcher onSwitch={onClose} onAddClick={() => $accountSwitcherRouter.next()} />
{:else if $accountSwitcherRoute === AccountSwitcherRoute.CreateAccount}
    <CreateAccount {onCreate} onCancel={() => $accountSwitcherRouter.previous()} />
{:else if $accountSwitcherRoute === AccountSwitcherRoute.Password}
    <StrongholdUnlock {onSuccess} onCancel={() => $accountSwitcherRouter.previous()} />
{/if}
