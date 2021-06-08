<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { ImportType } from 'shared/lib/profile'
    import { createEventDispatcher, getContext, onMount } from 'svelte'
    import type { Writable } from 'svelte/store'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()
    const importType = getContext<Writable<ImportType>>('importType')

    let localizedGroup = 'default'

    onMount(() => {
        switch ($importType) {
            case ImportType.FireflyLedger:
                localizedGroup = 'fireflyLedger'
                break
            case ImportType.TrinityLedger:
                localizedGroup = 'trinityLedger'
                break
        }
    })

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5 text-center">
                <div class="bg-green-100 rounded-2xl relative -top-10">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{locale(`views.importSuccess.${localizedGroup}.title`)}</Text>
                <Text type="p" secondary classes="mb-2">{locale(`views.importSuccess.${localizedGroup}.body`)}</Text>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
            <!-- TODO: ledger, add success for ledger -->
            {#if $importType !== ImportType.TrinityLedger}
                <Animation
                    animation={$importType === ImportType.Seed || $importType === ImportType.Mnemonic ? 'import-from-text-success-desktop' : 'import-from-file-success-desktop'} />
            {/if}
        </div>
    </OnboardingLayout>
{/if}
