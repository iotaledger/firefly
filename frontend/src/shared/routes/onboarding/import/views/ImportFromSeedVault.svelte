<script>
    import { OnboardingLayout, Password, Text, Button } from '@shared-components'
    export let locale
    export let mobile
    export let goto

    let password = ''
    let valid = false

    $: valid = password.length > 8
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.import_from_seedvault.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_from_seedvault.body')}</Text>
            <Password classes="mb-6" bind:value={password} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => goto('balance')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16" />
    </OnboardingLayout>
{/if}
