<script lang="typescript">
    import { localize } from '@core/i18n'
    import { INode } from '@core/network'
    import { appRouter } from '@core/router'
    import { OnboardingLayout, Text, Button, Spinner, NodeConfigurationForm } from 'shared/components'

    let nodeConfigurationForm: NodeConfigurationForm
    let node: INode
    let isBusy = false

    function onBackClick(): void {
        $appRouter.previous()
    }
    function onSuccess(): void {
        $appRouter.next()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.customNetwork.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.customNetwork.body')}</Text>
        <NodeConfigurationForm
            bind:this={nodeConfigurationForm}
            bind:node
            bind:isBusy
            hideButtons
            hideCheckbox
            {onSuccess}
        />
    </div>
    <div slot="leftpane__action">
        <Button
            disabled={!node?.url || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-full"
            onClick={nodeConfigurationForm?.handleAddNode}
        >
            {#if isBusy}
                <Spinner busy={isBusy} message={localize('popups.node.addingNode')} classes="justify-center" />
            {:else}
                {localize('actions.continue')}
            {/if}
        </Button>
    </div>
</OnboardingLayout>
