<script lang="typescript">
    import { HR, MenuItem } from 'shared/components'
    import { clickOutside } from 'shared/lib/actions'
    import { localize } from '@core/i18n'
    import {
        getOfficialNodes,
        INode,
        IClientOptions,
        removeNodeFromClientOptions,
        toggleDisabledNodeInClientOptions,
    } from '@core/network'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { activeProfile } from '@core/profile'

    export let node: INode
    export let contextPosition: {
        x: number
        y: number
    }
    export let clientOptions: IClientOptions

    $: isOfficialNode = getOfficialNodes($activeProfile?.networkProtocol, $activeProfile?.networkType).some(
        (n) => n.url === node?.url
    )
    $: allowDisableOrRemove = node?.disabled || clientOptions?.nodes?.filter((node) => !node.disabled)?.length > 1

    function handleEditNodeDetailsClick(): void {
        openPopup({
            type: 'addNode',
            props: {
                node,
                isEditingNode: true,
                onSuccess: () => {
                    node = undefined
                    closePopup()
                },
            },
        })
    }

    function handleRemoveNodeClick(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.node.titleRemove'),
                description: localize('popups.node.removeConfirmation'),
                danger: true,
                confirmText: localize('actions.removeNode'),
                onConfirm: () => {
                    void removeNodeFromClientOptions(node)
                    node = undefined
                    closePopup()
                },
            },
        })
    }

    function handleToggleDisabledNodeClick(): void {
        if (node.disabled) {
            toggleDisabledNodeInClientOptions(node)
        } else {
            openPopup({
                type: 'confirmation',
                props: {
                    title: localize('popups.excludeNode.title'),
                    description: localize('popups.excludeNode.body', { values: { url: node?.url } }),
                    danger: true,
                    confirmText: localize('views.settings.configureNodeList.excludeNode'),
                    onConfirm: () => {
                        toggleDisabledNodeInClientOptions(node)
                        closePopup()
                    },
                },
            })
        }
        node = undefined
    }
</script>

<node-config-options
    class="fixed flex flex-col border border-solid bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 rounded-lg overflow-hidden"
    use:clickOutside={{ includeScroll: true }}
    on:clickOutside={() => (node = undefined)}
    style={`left: ${contextPosition.x - 10}px; top: ${contextPosition.y - 10}px`}
>
    <MenuItem
        title={localize('views.settings.configureNodeList.editDetails')}
        onClick={handleEditNodeDetailsClick}
        disabled={isOfficialNode}
        first
    />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize(`views.settings.configureNodeList.${node.disabled ? 'include' : 'exclude'}Node`)}
        onClick={handleToggleDisabledNodeClick}
        last
    />
    <HR />
    <MenuItem
        disabled={!allowDisableOrRemove}
        title={localize('views.settings.configureNodeList.removeNode')}
        onClick={handleRemoveNodeClick}
        first
        last
    />
</node-config-options>
