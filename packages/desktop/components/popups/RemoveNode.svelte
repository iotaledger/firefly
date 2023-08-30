<script lang="ts">
    import { Button, Text } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'

    export let node
    export let removeAll = false
    export let onSuccess: (..._: any[]) => void

    function onRemoveCustomNodeClick(): void {
        if (onSuccess) {
            onSuccess(node)
        }
        closePopup()
    }
</script>

<Text type="h4" classes="mb-5">{localize(`popups.node.titleRemove${removeAll ? 'All' : ''}`)}</Text>
<div class="w-full h-full mb-7">
    <Text>{localize(`popups.node.remove${removeAll ? 'All' : ''}Confirmation`)}</Text>
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8">
    <Button outline classes="w-1/2" onClick={closePopup}>{localize('actions.no')}</Button>
    <Button classes="w-1/2" onClick={onRemoveCustomNodeClick}>{localize('actions.yes')}</Button>
</div>
