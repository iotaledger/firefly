<script>
    import { OnboardingLayout, Illustration, Text, Button, Input } from '@shared-components'
    import { validateSeed } from '@shared-lib/utils'
    export let locale
    export let mobile
    export let goto

    let valid = false
    let seedInput = ''

    $: valid = validateSeed(seedInput)
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.import_from_seed.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.import_from_seed.body_1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_from_seed.body_2')}</Text>
            <Input bind:value={seedInput} placeholder={locale('general.your_seed')} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button ghost onClick={() => goto('import-from-seedvault')}>{locale('actions.import_seedvault')}</Button>
            <Button disabled={!valid} onClick={() => goto('balance')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-from-seed-desktop" />
        </div>
    </OnboardingLayout>
{/if}
