<script lang="typescript">
    import { Locale, localize } from '@core/i18n'
    import { tabFormWithEnterKey } from '@lib/keyboard'
    import { Animation, Button, OnboardingLayout, Password, Text } from 'shared/components'
    import { getKeyboardTransitionSpeed, isKeyboardOpened, keyboardHeight, mobile } from 'shared/lib/app'
    import { createEventDispatcher } from 'svelte'
    import { strongholdPassword } from '@lib/app'

    export let locale: Locale
    export let currentPassword: string = undefined
    export let next: (...args) => Promise<void>

    $: bodyText = currentPassword
        ? localize('views.updateStronghold.update.body1')
        : `${localize('views.updateStronghold.update.body1')} ${localize('views.updateStronghold.update.body2')}`

    const dispatch = createEventDispatcher()

    let password = ''
    let error = ''
    let passwordContainer: HTMLElement
    let busy = false

    $: password, (error = '')
    $: if ($isKeyboardOpened || error) {
        setTimeout(() => {
            passwordContainer?.parentElement?.scrollTo(0, passwordContainer?.parentElement?.scrollHeight)
        }, getKeyboardTransitionSpeed($isKeyboardOpened))
    }

    function onKeyPress(e) {
        tabFormWithEnterKey(e, document, 'update-stronghold-form')
    }

    async function handleContinueClick() {
        busy = true
        $strongholdPassword = currentPassword ?? password
        await next()
        busy = false
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.updateStronghold.update.title')}</Text>
    </div>
    <div
        slot="leftpane__content"
        style="flex-auto margin-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: margin-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
        bind:this={passwordContainer}
    >
        <Text type="p" secondary classes="mb-4">{bodyText}</Text>
        <form on:submit|preventDefault={handleContinueClick} on:keypress={onKeyPress} id="update-stronghold-form">
            {#if !currentPassword}
                <Password {error} classes="mb-4" bind:value={password} {locale} autofocus={!$mobile} disabled={busy} />
            {/if}
        </form>
    </div>
    <div
        slot="leftpane__action"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Button
            type="submit"
            form="update-stronghold-form"
            classes="w-full"
            disabled={(!password && !currentPassword) || busy}
        >
            {locale('actions.continue')}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden' : 'bg-pastel-yellow dark:bg-gray-900'}"
        style="margin-top: {$mobile && $isKeyboardOpened
            ? -$keyboardHeight
            : 0}px; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform ' : ''}"
            animation="backup-recovery-phrase-desktop"
        />
    </div>
</OnboardingLayout>
