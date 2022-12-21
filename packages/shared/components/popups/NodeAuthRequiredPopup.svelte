<script lang="typescript">
    import { Button, TextInput, Text, TextType, HTMLButtonType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import type { Auth } from '@iota/wallet'

    export let onSubmit: (auth: Auth) => unknown = () => {}

    let username: string
    let password: string
    let jwt: string

    let usernameError: string
    let passwordError: string
    let jwtError: string

    $: disabled = !username && !password && !jwt

    async function handleSubmit(): Promise<void> {
        try {
            const auth = { username, password, jwt }
            await onSubmit(auth)
        } catch (err) {
            const authenticationError = err?.error?.match(/(username)|(password)|(jwt)/g)?.[0]
            switch (authenticationError) {
                case 'username':
                    usernameError = err.error
                    break
                case 'password':
                    passwordError = err.error
                    break
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
            bind:value={username}
            bind:error={usernameError}
            placeholder={localize('general.username')}
            label={localize('general.username')}
        />
        <TextInput
            bind:value={password}
            bind:error={passwordError}
            placeholder={localize('general.password')}
            label={localize('general.password')}
        />
        <TextInput
            bind:value={jwt}
            bind:error={jwtError}
            placeholder={localize('general.jwt')}
            label={localize('general.jwt')}
        />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button {disabled} type={HTMLButtonType.Submit} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
