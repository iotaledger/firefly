<script lang="ts">
    import { Button, ColorPicker, Input } from '@ui'

    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { getTrimmedLength } from '@core/utils'

    import { closeDrawer, DrawerId, openDrawer } from '@/auxiliary/drawer'

    let accountAlias: string = ''
    let color: string = getRandomAccountColor()
    let isBusy: boolean = false
    let error: string

    $: accountAlias, (error = null)

    async function onCreate(): Promise<void> {
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
                    onSuccess: onCreate,
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
                submitHandler={onCreate}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <Button
        disabled={!getTrimmedLength(accountAlias) || isBusy}
        classes="w-full"
        onClick={onCreate}
        {isBusy}
        busyMessage={localize('general.creating')}
    >
        {localize('actions.create')}
    </Button>
</div>
