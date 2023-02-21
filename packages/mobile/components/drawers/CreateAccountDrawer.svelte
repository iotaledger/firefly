<script lang="ts">
    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { getTrimmedLength } from '@core/utils'
    import { Button, Input } from 'shared/components'
    import { ColorPicker } from '../../components'
    import { closeDrawer, DrawerId, openDrawer } from '../../lib/auxiliary/drawer'

    let accountAlias: string = ''
    let color: string = getRandomAccountColor()
    let isBusy: boolean = false
    let error: string

    $: accountAlias, (error = null)

    async function handleCreateClick(): Promise<void> {
        try {
            const trimmedAccountAlias = accountAlias.trim()

            if (!trimmedAccountAlias) {
                return
            }
            isBusy = true
            error = null
            await validateAccountName(trimmedAccountAlias)
            const isUnlocked = await isStrongholdUnlocked()
            if (isUnlocked) {
                await tryCreateAdditionalAccount(accountAlias, color)
                closeDrawer(DrawerId.CreateAccount)
            } else {
                openDrawer(DrawerId.EnterPassword, {
                    onSuccess: handleCreateClick,
                })
            }
            isBusy = false
        } catch (err) {
            error = err.error
            handleError(err)
            isBusy = false
        }
    }
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <Button
        disabled={!getTrimmedLength(accountAlias) || isBusy}
        classes="w-full"
        onClick={handleCreateClick}
        {isBusy}
        busyMessage={localize('general.creating')}
    >
        {localize('actions.create')}
    </Button>
</div>
