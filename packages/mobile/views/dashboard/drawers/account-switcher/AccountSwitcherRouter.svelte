<script lang="typescript">
    import { tryCreateAdditionalAccount } from '@core/account'
    import { isStrongholdUnlocked } from '@core/profile-manager'

    import { StrongholdUnlock } from '../../../../components'
    import { AccountSwitcherRoute, accountSwitcherRoute, accountSwitcherRouter } from '../../../../lib/routers'
    import { AccountSwitcher, CreateAccount } from './views'

    export let onClose: () => unknown = () => {}

    let accountAlias: string
    let color: string
    let submitCreation: boolean = false

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

    function onSuccess(): void {
        submitCreation = true
        $accountSwitcherRouter.previous()
    }
</script>

{#if $accountSwitcherRoute === AccountSwitcherRoute.Switcher}
    <AccountSwitcher onSwitch={onClose} onAddClick={() => $accountSwitcherRouter.next()} />
{:else if $accountSwitcherRoute === AccountSwitcherRoute.CreateAccount}
    <CreateAccount
        {onCreate}
        {submitCreation}
        {accountAlias}
        {color}
        onCancel={() => $accountSwitcherRouter.previous()}
    />
{:else if $accountSwitcherRoute === AccountSwitcherRoute.Password}
    <StrongholdUnlock {onSuccess} onCancel={() => $accountSwitcherRouter.previous()} />
{/if}
