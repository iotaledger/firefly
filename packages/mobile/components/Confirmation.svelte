<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, ButtonVariant, Text, TextHint } from 'shared/components'

    export let description: string = ''
    export let hint: string = ''
    export let info: boolean = false
    export let success: boolean = false
    export let warning: boolean = false
    export let danger: boolean = false
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => void = undefined
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="space-y-4">
        {#if description}
            <Text fontSize="14" classes="text-left">{description}</Text>
        {/if}
        {#if hint}
            <TextHint {info} {success} {warning} {danger} text={hint} />
        {/if}
    </div>
    <Button
        classes="w-full"
        variant={warning || danger ? ButtonVariant.Warning : ButtonVariant.Primary}
        onClick={onConfirm}
    >
        {confirmText}
    </Button>
</div>
