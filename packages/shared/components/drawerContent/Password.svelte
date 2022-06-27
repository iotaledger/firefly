<script lang="typescript">
    import { Animation, Button, Icon, Password, Text } from 'shared/components'
    import { Locale } from '@core/i18n'

    import { mobile } from '@lib/app'
    import { api } from '@lib/wallet'

    export let locale: Locale
    export let returnPassword = false

    export let onSuccess = (..._: any[]): void => {}
    export let onError = (..._: any[]): void => {}
    export let handleBackButton = (..._: any[]): void => {}

    let password
    let error = ''

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                handleBackButton()
                if ('function' === typeof onSuccess) {
                    onSuccess(returnPassword ? password : response)
                }
            },
            onError(err) {
                error = locale(err.error)
                if ('function' === typeof onError) {
                    onError(err)
                }
            },
        })
    }
</script>

<button on:click={handleBackButton} class="absolute top-8 -left-2">
    <Icon icon="arrow-left" classes="absolute mb-5 left-8 text-gray-500 text-blue-500" />
</button>
<div class="flex flex-col items-center justify-items-center p-5">
    <div class="w-full text-center mt-3">
        <Text type="h4">{locale('popups.password.title')}</Text>
    </div>
    <div class="w-full overflow-hidden mt-5 grid">
        <div class="w-full">
            <Animation classes="relative right-2.5" animation="password-desktop" scale={1.2} />
        </div>
    </div>
    <div class="mb-3">
        <Text type="p" secondary>{locale('popups.password.subtitle')}</Text>
    </div>
    <Password
        {error}
        classes="w-full mb-5"
        bind:value={password}
        showRevealToggle
        {locale}
        placeholder={locale('general.password')}
        autofocus={!$mobile}
    />
    <div class="unlockButton w-full absolute left-0 px-5">
        <Button classes="w-full justify-center" onClick={() => handleSubmit()}>{locale('actions.unlock')}</Button>
    </div>
</div>

<style>
    .unlockButton {
        bottom: calc(env(safe-area-inset-bottom) + 30px);
    }
</style>
