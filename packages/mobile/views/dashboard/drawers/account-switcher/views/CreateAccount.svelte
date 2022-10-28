<script lang="typescript">
    import { ColorPicker } from '../../../../../components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { getRandomAccountColor, validateAccountName } from '@core/account'
    import { BaseError } from '@core/error'

    export let accountAlias: string = ''
    export let color: string = getRandomAccountColor()
    export let isBusy: boolean = false

    export let onCreate: (accountAlias: string, color: string) => unknown = () => {}
    export let onCancel: () => unknown = () => {}

    let error: BaseError

    $: accountAlias, (error = null)
    $: trimmedAccountAlias = accountAlias.trim()

    async function handleCreateClick(): Promise<void> {
        try {
            if (!trimmedAccountAlias) {
                return
            }

            isBusy = true
            error = null
            await validateAccountName(trimmedAccountAlias)
            await onCreate(trimmedAccountAlias, color.toString())
            isBusy = false
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error, logToConsole: true }) : err
            }
            isBusy = false
        }
    }

    function handleCancelClick(): void {
        isBusy = false
        onCancel()
    }
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="w-full flex flex-col justify-between">
            <Input
                error={error?.message}
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
    <div class="flex flex-row justify-between px-2">
        <Button outline classes="-mx-2 w-1/2" onClick={handleCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!getTrimmedLength(accountAlias) || isBusy}
            classes="-mx-2 w-1/2"
            onClick={handleCreateClick}
            {isBusy}
            busyMessage={localize('general.creating')}
        >
            {localize('actions.create')}
        </Button>
    </div>
</div>
