<script>
    import { generateRecoveryPhrase } from '@shared-lib/utils'
    import { OnboardingLayout, RecoveryPhrase, Text, Button } from '@shared-components'

    export let locale
    export let mobile
    export let goto

    let recoveryPhrase = generateRecoveryPhrase().split(' ')
    let valid
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.verify-recovery-phrase.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.verify-recovery-phrase.body')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => goto('congratulations')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16">
            <RecoveryPhrase {recoveryPhrase} shuffle bind:valid />
        </div>
    </OnboardingLayout>
{/if}
