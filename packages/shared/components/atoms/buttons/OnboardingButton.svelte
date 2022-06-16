<script lang="typescript">
    import { Button } from 'shared/components'

    export let icon = undefined
    export let iconColor = ''
    export let iconHeight: string
    export let iconWidth: string
    export let classes = ''
    export let secondary = false
    export let hidden = false
    export let disabled = false

    export let onClick: () => unknown
</script>

<Button {icon} {iconColor} {iconHeight} {iconWidth} {classes} {secondary} {hidden} {disabled} {onClick}>
    <slot />
</Button>
