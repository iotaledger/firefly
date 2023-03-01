<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { localize } from '@core/i18n'
    import { addNodeToClientOptions, editNodeInClientOptions, INode } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Button, HTMLButtonType, NodeConfigurationForm } from '@ui'

    export let node: INode = undefined
    export let isEditingNode: boolean = false
    export let onSuccess: (..._: any[]) => void

    const currentNode = node

    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            const validatedNode = await nodeConfigurationForm.buildNode({
                checkNodeInfo: true,
                checkSameNetwork: true,
                uniqueCheck: !isEditingNode,
                validateClientOptions: true,
            })
            if (isEditingNode) {
                await editNodeInClientOptions(currentNode, validatedNode)
            } else {
                await addNodeToClientOptions(validatedNode)
            }
            onSuccess()
        } catch (err) {
            if (err.type !== 'validationError') {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
                })
            }
        } finally {
            isBusy = false
        }
    }
</script>

<div class="flex flex-col justify-between space-y-4 h-full">
    <NodeConfigurationForm
        bind:this={nodeConfigurationForm}
        bind:node
        {onSubmit}
        {isBusy}
        isDeveloperProfile={$activeProfile.isDeveloperProfile}
    />
    <Button
        disabled={!node.url || isBusy}
        type={HTMLButtonType.Submit}
        form="node-configuration-form"
        classes="w-full"
        {isBusy}
        busyMessage={localize(`popups.node.${isEditingNode ? 'updatingNode' : 'addingNode'}`)}
    >
        {localize(`actions.${isEditingNode ? 'updateNode' : 'addNode'}`)}
    </Button>
</div>
