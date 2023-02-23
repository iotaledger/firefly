<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { localize } from '@core/i18n'
    import { addNodeToClientOptions, editNodeInClientOptions, EMPTY_NODE, INode } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Button, HTMLButtonType, NodeConfigurationForm } from 'shared/components'

    const DEFAULT_EMPTY_NODE: INode = EMPTY_NODE

    export let node: INode = DEFAULT_EMPTY_NODE
    export let isEditingNode: boolean = false
    export let onSuccess: (..._: any[]) => void

    const currentNode = node

    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false

    async function handleSubmit(): Promise<void> {
        try {
            isBusy = true
            await nodeConfigurationForm.validate({
                validateUrl: true,
                checkSameNetwork: true,
                uniqueCheck: !isEditingNode,
                checkNodeInfo: true,
                validateClientOptions: true,
            })
            if (isEditingNode) {
                await editNodeInClientOptions(currentNode, node)
            } else {
                await addNodeToClientOptions(node)
            }
            node = DEFAULT_EMPTY_NODE
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
        onSubmit={handleSubmit}
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
