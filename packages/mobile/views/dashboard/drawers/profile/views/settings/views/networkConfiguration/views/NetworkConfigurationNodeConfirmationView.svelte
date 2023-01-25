<script lang="typescript">
    import { localize } from '@core/i18n'
    import { INode } from '@core/network'
    import { Button, ButtonVariant, Text, TextType } from 'shared/components'
    import { NetworkConfigurationSettingsAction } from '../../../../../../../../../lib/contexts/settings'

    export let action: NetworkConfigurationSettingsAction = undefined
    export let node: INode = { url: '' }
    export let onConfirm: () => void = undefined
    export let onCancel: () => void = undefined

    let descriptionText: string = ''
    let confirmButtonText: string = ''

    $: action, setContent()

    function setContent(): void {
        switch (action) {
            case NetworkConfigurationSettingsAction.UnsetAsPrimaryNode:
                descriptionText = localize('popups.unsetAsPrimaryNode.body', { values: { url: node.url } })
                confirmButtonText = localize('actions.clear')
                break
        }
    }
</script>

<div class="flex-1 flex flex-col justify-between space-y-4">
    <Text type={TextType.p}>{descriptionText}</Text>
    <div class="flex flex-col w-full space-y-4">
        <Button classes="w-full" outline onClick={onCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" variant={ButtonVariant.Warning} onClick={onConfirm}>
            {confirmButtonText}
        </Button>
    </div>
</div>
