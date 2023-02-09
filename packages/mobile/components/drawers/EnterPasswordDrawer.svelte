<script lang="ts">
    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile'
    import { Button, HTMLButtonType, PasswordInput, Text, TextType } from 'shared/components'
    import { Drawer } from '../../components'

    export let busyMessage: string = ''

    export let onClose: () => unknown = () => {}
    export let onSuccess: (password?: string) => unknown
    export let onCancel: () => unknown
    export let returnPassword = false

    let password: string
    let error: string
    let isBusy = false

    async function handleSubmit(): Promise<void> {
        try {
            error = ''
            isBusy = true
            await unlockStronghold(password)
            onSuccess && onSuccess(returnPassword ? password : undefined)
            isBusy = false
        } catch (err) {
            console.error(err)
            error = localize(err?.message ?? err)
            isBusy = false
        }
    }

    function handleCancelClick(): void {
        onCancel && onCancel()
    }
</script>

<Drawer {onClose}>
    <div class="mb-5">
        <Text type={TextType.p} secondary>{localize('popups.password.subtitle')}</Text>
    </div>
    <form
        id="password-popup-form"
        class="flex justify-center w-full flex-row flex-wrap"
        on:submit|preventDefault={handleSubmit}
    >
        <PasswordInput
            bind:error
            classes="w-full mb-5"
            bind:value={password}
            showRevealToggle
            placeholder={localize('general.password')}
            autofocus
        />
        <div class="flex flex-row justify-between w-full space-x-4">
            <Button outline classes="w-1/2" onClick={handleCancelClick} disabled={isBusy}>
                {localize('actions.cancel')}
            </Button>
            <Button
                classes="w-1/2"
                type={HTMLButtonType.Submit}
                disabled={!password || password.length === 0 || isBusy}
                {isBusy}
                {busyMessage}
            >
                {localize('actions.unlock')}
            </Button>
        </div>
    </form>
</Drawer>
