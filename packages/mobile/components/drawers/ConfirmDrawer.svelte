<script lang="ts">
    import { Button, ButtonVariant, Text, TextHint } from '@ui'

    import { localize } from '@core/i18n'
    import { TextHintVariant } from '@ui/TextHint.svelte'

    export let description: string = ''
    export let hint: string = ''
    export let variant: TextHintVariant | undefined = undefined
    export let confirmText: string = localize('actions.confirm')
    export let onConfirm: () => void = undefined
</script>

<confirm-drawer class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <div class="space-y-4">
        {#if description}
            <Text fontSize="14" classes="text-left">{description}</Text>
        {/if}
        {#if hint}
            <TextHint {variant} text={hint} />
        {/if}
    </div>

    <Button
        classes="w-full"
        variant={variant === TextHintVariant.Warning || variant === TextHintVariant.Danger
            ? ButtonVariant.Warning
            : ButtonVariant.Primary}
        onClick={onConfirm}
    >
        {confirmText}
    </Button>
</confirm-drawer>
