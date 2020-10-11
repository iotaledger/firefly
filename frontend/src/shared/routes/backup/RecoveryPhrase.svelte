<script>
    import { generateRecoveryPhrase } from '@shared-lib/utils'
    import { OnboardingLayout, RecoveryPhrase, Text, Button } from '@shared-components'

    export let locale
    export let mobile
    export let goto

    let recoveryPhrase = generateRecoveryPhrase().split(' ')
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.recovery-phrase.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.recovery-phrase.body_1')}</Text>
            <Text type="p" secondary highlighted classes="font-bold">{locale('views.recovery-phrase.body_2')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button ghost onClick={() => goto('backup-recovery-phrase')}>{locale('actions.save_backup')}</Button>
            <Button onClick={() => goto('verify-recovery-phrase')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16">
            <RecoveryPhrase {recoveryPhrase} />
        </div>
    </OnboardingLayout>
{/if}
