<script lang="ts">
    import { Button, HTMLButtonType, Text, TextInput, TextType } from '@ui'
    import type { Auth } from '@iota/sdk/out/types'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'

    export let onSubmit: (auth: Auth) => unknown = () => {}

    let isBusy = false

    let jwt: string
    let jwtError: string

    $: disabled = !jwt || isBusy

    async function handleSubmit(): Promise<void> {
        try {
            isBusy = true
            const auth = { jwt }
            await onSubmit(auth)
            isBusy = false
        } catch (err) {
            isBusy = false
            const authenticationError = err?.error?.match(/(jwt)/g)?.[0]
            switch (authenticationError) {
                case 'jwt':
                    jwtError = err.error
                    break
                default:
                    handleError(err)
                    break
            }
        }
    }
</script>

<form id="node-auth-required" on:submit|preventDefault={handleSubmit}>
    <Text type={TextType.h3} classes="mb-6">{localize('popups.nodeAuthRequired.title')}</Text>
    <Text fontSize="15">{localize('popups.nodeAuthRequired.body')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-4">
        <TextInput
            bind:value={jwt}
            bind:error={jwtError}
            placeholder={localize('general.jwt')}
            label={localize('general.jwt')}
        />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button {disabled} {isBusy} type={HTMLButtonType.Submit} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
