<script lang="typescript">
    import { BundleMiningLayout, Button, Icon, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const legacyLedger = $walletSetupType === SetupType.TrinityLedger

    const dispatch = createEventDispatcher()

    const handleContinueClick = () => {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <BundleMiningLayout
        onBackClick={handleBackClick}
        {locale}
        showLedgerProgress={legacyLedger}
        showLedgerVideoButton={legacyLedger}>
        <div slot="icon_boxed">
            <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-orange-600 shadow-lg">
                <Icon boxed="true" icon="warning-filled" classes="text-white" />
            </div>
        </div>
        <div slot="box_content">
            <Text type="h2" classes="mb-5 text-center">{locale('views.bundleMiningWarning.title')}</Text>
            <Text type="p" secondary classes="mb-4 text-center">{locale('views.bundleMiningWarning.body1')}</Text>
            <Text type="p" secondary classes="mb-8 text-center">{locale('views.bundleMiningWarning.body2')}</Text>
            <div class="flex flex-col flex-grow items-center">
                <Button secondary classes="w-56" onClick={() => Electron.openUrl('https://firefly.iota.org/faq#spent-addresses')}>
                    {locale('views.bundleMiningWarning.learn')}
                </Button>
            </div>
        </div>
        <div slot="actions">
            <Button classes="w-64 my-8" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
    </BundleMiningLayout>
{/if}
