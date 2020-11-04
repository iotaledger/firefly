<script>
    import { OnboardingLayout, Illustration, Text, Button, Input } from '@shared-components'
    import { loading } from '@shared-lib/app'
    import { validateRecoveryPhrase } from '@shared-lib/utils'
    export let locale
    export let mobile
    export let goto

    let valid = false
    let recoveryPhrase = ''
    let signInSucess = false

    $: valid = !$loading && (validateRecoveryPhrase(recoveryPhrase) || signInSucess)

    $: if ($loading) {
        setTimeout(() => {
            loading.set(false)
            signInSucess = true
        }, 10000)
    }

    function handleClick() {
        if (!signInSucess) {
            loading.set(true)
        } else {
            goto('protect')
        }
    }
</script>

<style type="text/scss">
    pulsating-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--ui-blue-color);
        &.pulse {
            animation: pulse-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
            svg {
                display: none;
            }
        }
        svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            path {
                fill: white;
            }
        }
    }
    @keyframes pulse-dot {
        0% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(1);
        }
        100% {
            transform: scale(0.8);
        }
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.import_from_recovery_phrase.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_from_recovery_phrase.body')}</Text>
            {#if !$loading && !signInSucess}
                <Input bind:value={recoveryPhrase} placeholder={locale('general.recovery_phrase')} />
            {:else}
                <loader class="block mt-24">
                    <pulsating-circle class:pulse={$loading} class="block relative mx-auto">
                        <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M22.5905 1.22007C23.1593 1.82235 23.1322 2.77171 22.5299 3.34052L7.97013 17.0915L0.93934 10.0607C0.353553 9.47488 0.353553 8.52513 0.93934 7.93934C1.52513 7.35356 2.47487 7.35356 3.06066 7.93934L8.02987 12.9086L20.4701 1.15948C21.0723 0.590667 22.0217 0.617791 22.5905 1.22007Z" />
                        </svg>
                    </pulsating-circle>
                    {#if signInSucess}
                        <Text type="p" highlighted secondary classes="mx-16 mt-5 mb-8 text-center">
                            {locale('views.import_from_recovery_phrase.success')}
                        </Text>
                    {/if}
                </loader>
            {/if}
        </div>
        <div
            slot="leftpane__action"
            class={`${$loading || signInSucess ? 'justify-end' : 'justify-between'} flex flex-row items-center`}>
            <Button
                classes={`${$loading || signInSucess ? 'hidden' : ''}`}
                ghost
                onClick={() => goto('import-from-security-phrase-file')}>
                {locale('actions.import_from_file')}
            </Button>
            <Button disabled={!valid} onClick={() => handleClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-from-recovery-phrase-desktop" />
        </div>
    </OnboardingLayout>
{/if}
