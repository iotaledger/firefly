<script lang="ts">
    import { Button, HTMLButtonType, PasswordInput, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile'

    import { closeDrawer, DrawerId } from '@/auxiliary/drawer'

    export let busyMessage: string = ''

    export let onSuccess: (password?: string) => unknown
    export let returnPassword: boolean = false

    let password: string
    let error: string
    let isBusy = false

    async function handleSubmit(): Promise<void> {
        try {
            error = ''
            isBusy = true
            await unlockStronghold(password)
            closeDrawer(DrawerId.EnterPassword)
            onSuccess && onSuccess(returnPassword ? password : undefined)
        } catch (err) {
            console.error(err)
            error = localize(err?.message ?? err)
        } finally {
            isBusy = false
        }
    }
</script>

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
    <Button
        classes="w-full"
        type={HTMLButtonType.Submit}
        disabled={!password || password.length === 0 || isBusy}
        {isBusy}
        {busyMessage}
    >
        {localize('actions.unlock')}
    </Button>
</form>
